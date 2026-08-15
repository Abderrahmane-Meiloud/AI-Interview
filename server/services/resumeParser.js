import mammoth from 'mammoth';
import { extractImages, extractText, getDocumentProxy } from 'unpdf';
import { PNG } from 'pngjs';
import { createWorker } from 'tesseract.js';

// Resumes exported/printed as PDFs occasionally have no real text layer (the
// visible content is a rasterized image per page, e.g. from certain design
// tools). unpdf then correctly returns near-empty text with no error. Below
// this length we treat that as "no usable text" and fall back to OCR on the
// page images, entirely from the in-memory buffer (no filesystem, no native
// canvas, no browser worker) so it stays compatible with the Vercel
// serverless runtime.
const MIN_TEXT_LENGTH = 50;

// Converts unpdf's raw pixel output (Uint8ClampedArray + width/height/
// channels) into a PNG buffer, since tesseract.js needs an encoded image
// file, not raw pixels. pngjs is pure JS (no native binary), matching the
// same serverless-safe constraint as the rest of this pipeline.
const encodeImageAsPNG = ({ data, width, height, channels }) => {
  const png = new PNG({ width, height });

  if (channels === 4) {
    png.data = Buffer.from(data);
  } else if (channels === 3) {
    const rgba = Buffer.alloc(width * height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      rgba[j] = data[i];
      rgba[j + 1] = data[i + 1];
      rgba[j + 2] = data[i + 2];
      rgba[j + 3] = 255;
    }
    png.data = rgba;
  } else {
    const rgba = Buffer.alloc(width * height * 4);
    for (let i = 0, j = 0; i < data.length; i++, j += 4) {
      rgba[j] = rgba[j + 1] = rgba[j + 2] = data[i];
      rgba[j + 3] = 255;
    }
    png.data = rgba;
  }

  return PNG.sync.write(png);
};

// OCR fallback for PDFs with no extractable text layer: pulls the embedded
// raster image(s) off each page and runs them through Tesseract. Only
// called when normal extraction is insufficient, since OCR is much slower
// than reading a text layer directly.
const extractTextViaOCR = async (pdf) => {
  // Vercel's function filesystem is read-only outside /tmp and not
  // guaranteed to persist between invocations, so the language data must
  // never be cached to disk (tesseract.js defaults to caching in the
  // current working directory otherwise).
  const worker = await createWorker('eng', undefined, { cacheMethod: 'none' });
  try {
    let combinedText = '';
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const images = await extractImages(pdf, pageNumber);
      for (const image of images) {
        const pngBuffer = encodeImageAsPNG(image);
        const { data } = await worker.recognize(pngBuffer);
        combinedText += `\n${data.text}`;
      }
    }
    return combinedText;
  } finally {
    await worker.terminate();
  }
};

export const extractTextFromFile = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    if (text.trim().length < MIN_TEXT_LENGTH) {
      return extractTextViaOCR(pdf);
    }

    return text;
  }

  if (
    mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
};

export default { extractTextFromFile };
