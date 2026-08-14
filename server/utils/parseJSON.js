export const parseAIJSON = (text) => {
  if (!text) throw new Error('Empty AI response');

  let cleaned = text.trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const arrayStart = cleaned.indexOf('[');
    const arrayEnd = cleaned.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      try {
        return JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1));
      } catch {
        throw new Error('Failed to parse AI JSON response');
      }
    }
    throw new Error('Failed to parse AI JSON response');
  }
};
