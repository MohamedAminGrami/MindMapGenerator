/**
 * Filename Utilities
 * 
 * Utilities for generating safe filenames from text,
 * with proper handling of Arabic, Unicode, and other non-Latin characters.
 * 
 * @module utils/filenameUtils
 */

/**
 * Generates a safe filename from a subject string.
 * Handles Arabic, Unicode, and other non-Latin characters properly.
 * 
 * @param {string} text - The subject or title text
 * @returns {string} A safe filename string
 */
export const generateSafeFilename = (text) => {
  if (!text || typeof text !== 'string') {
    return `mindmap-${Date.now()}`;
  }
  
  // First, try to create a readable filename
  // Replace common problematic characters with hyphens
  let filename = text
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-') // Remove filesystem-unsafe characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Check if the filename has meaningful content (not just dashes/empty)
  // This handles cases where the entire text was non-Latin (Arabic, Chinese, etc.)
  const hasLatinChars = /[a-zA-Z0-9]/.test(filename);
  const hasUnicodeChars = /[\u0600-\u06FF\u0750-\u077F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(text);
  
  if (hasLatinChars && filename.length > 0) {
    // Has Latin characters, use the cleaned filename but limit length
    return `mindmap-${filename.substring(0, 50)}`;
  } else if (hasUnicodeChars) {
    // Has Unicode characters (Arabic, Chinese, Japanese, Korean)
    // Use URL encoding to create a safe filename that preserves meaning
    const encodedText = encodeURIComponent(text.substring(0, 30))
      .replace(/%/g, '') // Remove percent signs for cleaner filename
      .substring(0, 40);
    return `mindmap-${encodedText}-${Date.now()}`;
  } else {
    // Fallback to timestamp-based name
    return `mindmap-${Date.now()}`;
  }
};

/**
 * Check if a string contains Arabic characters
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains Arabic characters
 */
export const containsArabic = (text) => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
};

/**
 * Check if a string contains CJK (Chinese, Japanese, Korean) characters
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains CJK characters
 */
export const containsCJK = (text) => {
  const cjkRegex = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/;
  return cjkRegex.test(text);
};

const filenameUtils = {
  generateSafeFilename,
  containsArabic,
  containsCJK,
};

export default filenameUtils;
