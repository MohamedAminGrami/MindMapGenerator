/**
 * Prompt Builder Module
 * 
 * Handles AI prompt construction for mind map generation.
 * Supports multiple languages (English, French, Arabic).
 * Detects verb conjugation mode vs topic exploration mode.
 */

const { 
  getIconsList, 
  LANGUAGE_INSTRUCTIONS, 
  VERB_KEYWORDS_PATTERN 
} = require('./constants');

const { buildVerbPrompt, buildTopicPrompt } = require('./promptTemplates');

/**
 * Get language-specific instructions for the AI
 * @param {string} language - Language code ('en', 'fr', 'ar')
 * @returns {string} Language instruction for the AI prompt
 */
function getLanguageInstruction(language) {
  return LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;
}

/**
 * Check if subject indicates verb conjugation mode
 * @param {string} subject - The input subject
 * @returns {boolean} True if verb mode is detected
 */
function isVerbMode(subject) {
  return VERB_KEYWORDS_PATTERN.test(subject);
}

/**
 * Clean subject by removing verb keywords for cleaner title
 * @param {string} subject - The input subject
 * @returns {string} Cleaned subject
 */
function cleanSubject(subject) {
  return subject.replace(VERB_KEYWORDS_PATTERN, '').trim();
}

/**
 * Build the complete prompt configuration for the AI API
 * @param {string} subject - The topic to generate a mind map for
 * @param {string} language - Output language code ('en', 'fr', 'ar')
 * @returns {object} Complete API request configuration
 */
function buildMindMapPrompt(subject, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  if (isVerbMode(subject)) {
    // VERB CONJUGATION MODE
    const cleaned = cleanSubject(subject);
    return buildVerbPrompt(cleaned, languageInstruction);
  }
  
  // TOPIC/KNOWLEDGE MODE (default)
  return buildTopicPrompt(subject, languageInstruction, getIconsList());
}

module.exports = {
  getLanguageInstruction,
  isVerbMode,
  cleanSubject,
  buildMindMapPrompt
};
