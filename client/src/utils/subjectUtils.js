/**
 * Helper to parse raw subject names into clean Primary Display Name and Secondary Paper Info.
 *
 * Example:
 *  "Paper 6: Financial Accounting" => { primaryName: "Financial Accounting", paperInfo: "Paper 6" }
 *  "Paper 11: Financial Management and Business Data Analytics" => { primaryName: "Financial Management & Business Data Analytics", paperInfo: "Paper 11" }
 *  "Cost Accounting" => { primaryName: "Cost Accounting", paperInfo: null }
 */
export function parseSubjectDisplay(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return { primaryName: 'Untitled Subject', paperInfo: '' };
  }

  const trimmed = rawName.trim();

  // Match pattern: "Paper <number>[: -] <Subject Name>"
  const match = trimmed.match(/^(Paper\s+\d+)\s*[:\-\u2014]?\s*(.*)$/i);
  if (match) {
    const paperNum = match[1]; // e.g. "Paper 6"
    let namePart = match[2].trim(); // e.g. "Financial Accounting"

    if (namePart) {
      // Normalize 'and' to '&' for cleaner display if preferred
      if (namePart.includes('Financial Management and Business Data Analytics')) {
        namePart = 'Financial Management & Business Data Analytics';
      }
      return {
        primaryName: namePart,
        paperInfo: paperNum
      };
    }

    return {
      primaryName: trimmed,
      paperInfo: paperNum
    };
  }

  return {
    primaryName: trimmed,
    paperInfo: ''
  };
}
