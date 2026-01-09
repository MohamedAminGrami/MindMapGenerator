// Available icon keywords for the AI prompt
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

function getLanguageInstruction(language) {
    switch (language) {
        case 'ar':
            return 'IMPORTANT: Respond ENTIRELY in Arabic (العربية). All text in the title, nodes, and children must be in Arabic only. Do not mix languages.';
        case 'fr':
            return 'IMPORTANT: Respond ENTIRELY in French (Français). All text in the title, nodes, and children must be in French only. Do not mix languages.';
        default:
            return 'IMPORTANT: Respond ENTIRELY in English. All text in the title, nodes, and children must be in English only. Do not mix languages.';
    }
}

// Build the messages array for the AI request
function buildMindMapPrompt(subject, language = 'en') {
    const languageInstruction = getLanguageInstruction(language);
    const iconsList = availableIcons.join(', ');
    
    return {
        messages: [
            {
                role: 'system',
                content: `You are a helpful assistant that generates structured mind map data in JSON format. 
Create comprehensive mind maps with 3-5 main branches, each with 2-4 sub-topics.
Every node must include an "icon" field with ONE keyword from this list: ${iconsList}
Choose the most relevant icon keyword for each concept.
The structure should be educational and well-organized.
${languageInstruction}`
            },
            {
                role: 'user',
                content: `Create a detailed mind map JSON for the subject: "${subject}". 
${languageInstruction}
Return ONLY valid JSON with this exact structure:
{
  "title": "Main Topic",
  "nodes": [
    {
      "text": "Branch 1 Name",
      "icon": "keyword_from_list",
      "children": [
        { "text": "Sub-topic 1", "icon": "keyword_from_list" },
        { "text": "Sub-topic 2", "icon": "keyword_from_list" }
      ]
    }
  ]
}
Use ONLY these icon keywords: ${iconsList}
Make sure to include 3-5 main branches with meaningful sub-topics.`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000
    };
}

module.exports = {
    availableIcons,
    getLanguageInstruction,
    buildMindMapPrompt
};
