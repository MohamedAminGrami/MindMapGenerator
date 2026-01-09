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
        max_tokens: 1000,
        messages: [
            {
                role: 'system',
                content: `You are a helpful assistant that generates structured mind map data in JSON format. 
Create comprehensive mind maps with 3-5 main branches, each with 2-4 sub-topics.
Every node must include an "icon" field with ONE keyword from: ${iconsList}
Choose the most relevant icon keyword for each concept.
${languageInstruction}`
            },
            {
                role: 'user',
                content: `Create a mind map JSON for: "${subject}". 
${languageInstruction}
Return ONLY valid JSON:
{
  "title": "Main Topic",
  "nodes": [
    {
      "text": "Branch Name",
      "icon": "icon_keyword",
      "children": [
        { "text": "Sub-topic", "icon": "icon_keyword" }
      ]
    }
  ]
}
Use ONLY these icons: ${iconsList}`
            }
        ]
    };
}

module.exports = {
    availableIcons,
    getLanguageInstruction,
    buildMindMapPrompt
};
