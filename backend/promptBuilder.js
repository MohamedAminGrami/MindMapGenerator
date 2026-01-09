/**
 * Prompt Builder Module
 * 
 * Handles AI prompt construction for mind map generation.
 * Supports multiple languages (English, French, Arabic).
 */

// Available icon keywords that map to react-icons in the frontend
const availableIcons = [
    // Education & Learning
    'education', 'book', 'study', 'school', 'graduation',
    // Science & Technology
    'science', 'technology', 'computer', 'code', 'data', 'server', 'network', 'cloud', 'mobile', 'atom',
    // Business & Finance
    'business', 'money', 'chart', 'growth', 'finance', 'payment', 'receipt', 'calculator',
    // Health & Wellness
    'health', 'medical', 'heart', 'fitness', 'running', 'swimming', 'cycling', 'sports',
    // Nature & Environment
    'nature', 'plant', 'earth', 'water',
    // Food & Drink
    'food', 'coffee', 'fruit', 'cooking',
    // Communication & Social
    'communication', 'social', 'people', 'chat', 'language', 'global',
    // Creative & Art
    'art', 'music', 'design', 'idea', 'film', 'camera', 'writing', 'gaming',
    // Travel & Transport
    'travel', 'plane', 'car', 'map', 'compass', 'rocket',
    // Time & Calendar
    'time', 'calendar', 'history',
    // Security & Testing
    'security', 'bug', 'testing', 'lock',
    // Buildings & Places
    'home', 'building', 'city', 'warehouse',
    // Legal & Government
    'legal', 'justice', 'government', 'landmark',
    // Brain & Strategy
    'brain', 'puzzle', 'strategy', 'blocks',
    // Achievement & Recognition
    'handshake', 'award', 'trophy', 'medal',
    // Files & Organization
    'file', 'folder', 'clipboard', 'tasks', 'search', 'filter', 'sort', 'list',
    // General
    'star', 'check', 'warning', 'info', 'settings', 'target', 'flag'
];

/**
 * Get language-specific instructions for the AI
 * @param {string} language - Language code ('en', 'fr', 'ar')
 * @returns {string} Language instruction for the AI prompt
 */
function getLanguageInstruction(language) {
    switch (language) {
        case 'ar':
            return 'IMPORTANT: Respond ENTIRELY in Arabic (العربية). All text must be in Arabic only.';
        case 'fr':
            return 'IMPORTANT: Respond ENTIRELY in French (Français). All text must be in French only.';
        default:
            return 'IMPORTANT: Respond ENTIRELY in English. All text must be in English only.';
    }
}

/**
 * Build the complete prompt configuration for the AI API
 * @param {string} subject - The topic to generate a mind map for
 * @param {string} language - Output language code ('en', 'fr', 'ar')
 * @returns {object} Complete API request configuration
 */
function buildMindMapPrompt(subject, language = 'en') {
    const languageInstruction = getLanguageInstruction(language);
    const iconsList = availableIcons.join(', ');
    
    return {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        messages: [
            {
                role: 'system',
                content: `You are an expert educational content creator that generates rich, comprehensive mind map data in JSON format.

FIRST, DETECT THE INPUT TYPE:
1. If the input is a VERB (action word like "to eat", "manger", "يأكل", "run", "speak"):
   - Create a VERB CONJUGATION mind map
   - Main branches = Tenses (Present, Past, Future, Conditional, etc.)
   - Children = Conjugations for different pronouns (I, You, He/She, We, They, etc.)
   - Include as many tenses as relevant for the language (6-10 tenses)
   - Include all pronoun forms as children (5-8 per tense)

2. If the input is a TOPIC/NOUN/CONCEPT:
   - Create a KNOWLEDGE mind map
   - Main branches = Key aspects, categories, or dimensions (4-8 branches)
   - Children = Detailed sub-topics, examples, facts (3-6 per branch)
   - Use varied vocabulary with different verb tenses in descriptions
   - Mix definitions, processes, examples, applications

IMPORTANT RULES:
- You can create MORE than 5 main branches if needed (up to 10)
- You can create MORE than 4 children per branch if needed (up to 10)
- Every node MUST include an "icon" field with ONE keyword from: ${iconsList}
- For verb conjugations, use "time" or "calendar" icons for tenses, "people" for pronouns

${languageInstruction}`
            },
            {
                role: 'user',
                content: `Create a mind map JSON for: "${subject}".

${languageInstruction}

DETECTION RULES:
- If "${subject}" is a verb → Create conjugation tables with tenses as branches
- If "${subject}" is a topic → Create educational content mind map

For VERBS, use this structure:
{
  "title": "Verb: [infinitive form]",
  "nodes": [
    {
      "text": "Present Tense",
      "icon": "time",
      "children": [
        { "text": "I [conjugation]", "icon": "people" },
        { "text": "You [conjugation]", "icon": "people" },
        { "text": "He/She [conjugation]", "icon": "people" },
        { "text": "We [conjugation]", "icon": "people" },
        { "text": "They [conjugation]", "icon": "people" }
      ]
    },
    {
      "text": "Past Tense",
      "icon": "history",
      "children": [...]
    }
  ]
}

For TOPICS, use this structure:
{
  "title": "Topic Title",
  "nodes": [
    {
      "text": "Main Concept",
      "icon": "relevant_icon",
      "children": [
        { "text": "Detailed point", "icon": "relevant_icon" }
      ]
    }
  ]
}

Return ONLY valid JSON. Use icons from: ${iconsList}`
            }
        ]
    };
}

module.exports = {
    availableIcons,
    getLanguageInstruction,
    buildMindMapPrompt
};
