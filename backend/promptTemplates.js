/**
 * Prompt Templates
 * 
 * AI prompt templates for different mind map generation modes.
 */

/**
 * Generate verb conjugation prompt
 * @param {string} subject - The verb to conjugate (cleaned)
 * @param {string} languageInstruction - Language-specific instruction
 * @returns {object} API message configuration
 */
const buildVerbPrompt = (subject, languageInstruction) => ({
  model: 'llama-3.3-70b-versatile',
  max_tokens: 3000,
  response_format: { type: "json_object" },
  messages: [
    {
      role: 'system',
      content: `You are a JSON generator for VERB CONJUGATION tables for TUNISIAN PRIMARY SCHOOL CHILDREN (grades 1-6, ages 6-12).

${languageInstruction}

CONTENT GUIDELINES:
- Use simple, common verbs appropriate for young learners
- Include only the most important tenses for primary school level
- Keep conjugations clear and easy to read

STRUCTURE:
- Title = The verb in infinitive form (in the required language)
- Main branches = Common tenses (Present, Past, Future - 4-6 tenses max)
- Children = Conjugations for pronouns (I, You, He/She, We, They)

RULES:
- Output ONLY valid JSON, no explanations
- Every node MUST have "text" and "icon" fields
- The "text" field must follow the language requirement strictly
- Use "time" or "history" icons for tenses, "people" for conjugations`
    },
    {
      role: 'user',
      content: `Generate verb conjugation JSON for: "${subject}"

${languageInstruction}

OUTPUT ONLY THIS JSON:
{
  "title": "Verb: [infinitive]",
  "nodes": [
    {
      "text": "Present Tense",
      "icon": "time",
      "children": [
        { "text": "I [conjugation]", "icon": "people" },
        { "text": "You [conjugation]", "icon": "people" }
      ]
    }
  ]
}`
    }
  ]
});

/**
 * Generate topic/knowledge mind map prompt
 * @param {string} subject - The topic to explore
 * @param {string} languageInstruction - Language-specific instruction
 * @param {string} iconsList - Comma-separated list of available icons
 * @returns {object} API message configuration
 */
const buildTopicPrompt = (subject, languageInstruction, iconsList) => ({
  model: 'llama-3.3-70b-versatile',
  max_tokens: 3000,
  response_format: { type: "json_object" },
  messages: [
    {
      role: 'system',
      content: `You are a JSON generator for EDUCATIONAL mind maps for TUNISIAN PRIMARY SCHOOL CHILDREN (grades 1-6, ages 6-12).

${languageInstruction}

CONTENT GUIDELINES:
- Content must be appropriate for young children (ages 6-12)
- Use simple, clear language that primary school students can understand
- Align content with Tunisian primary school curriculum and textbooks when possible
- Include educational facts, examples, and concepts suitable for young learners
- Avoid complex terminology - explain concepts simply

STRUCTURE:
- Main branches = Key aspects, categories (4-8 branches)
- Children = Simple details, examples, facts (2-4 per branch)
- Keep text SHORT - maximum 6-8 words per node

RULES:
- Output ONLY valid JSON, no explanations
- Every node MUST have "text" and "icon" fields
- The "text" field must follow the language requirement strictly
- The "icon" field must be one of: ${iconsList}`
    },
    {
      role: 'user',
      content: `Generate a child-friendly mind map for: "${subject}"

REMEMBER: ZERO Latin letters allowed! Every name must be in Arabic script!

${languageInstruction}

CORRECT ARABIC EXAMPLE (notice ALL text is Arabic script, NO Latin):
{
  "title": "حنبعل برقا",
  "nodes": [
    {
      "text": "العائلة",
      "icon": "people",
      "children": [
        { "text": "ابن حملقار برقا", "icon": "people" },
        { "text": "من قرطاج", "icon": "home" }
      ]
    },
    {
      "text": "المعارك",
      "icon": "flag",
      "children": [
        { "text": "معركة كاناي", "icon": "map" },
        { "text": "معركة تريبيا", "icon": "map" },
        { "text": "عبور جبال الألب", "icon": "earth" }
      ]
    },
    {
      "text": "الحرب مع روما",
      "icon": "history",
      "children": [
        { "text": "الحرب البونيقية الثانية", "icon": "history" },
        { "text": "هزيمة الرومان", "icon": "trophy" }
      ]
    }
  ]
}

OUTPUT ONLY VALID JSON:`
    }
  ]
});

module.exports = {
  buildVerbPrompt,
  buildTopicPrompt
};
