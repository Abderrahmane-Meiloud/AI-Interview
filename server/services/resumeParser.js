import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse/lib/pdf-parse.js');

export const extractTextFromFile = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
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
