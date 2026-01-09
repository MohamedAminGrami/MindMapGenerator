/**
 * Available Icons Constants
 * 
 * List of icon keywords that map to react-icons in the frontend.
 * Organized by category for easy maintenance.
 */

const AVAILABLE_ICONS = [
  // Education & Learning
  'education', 'book', 'study', 'school', 'graduation',
  
  // Science & Technology
  'science', 'technology', 'computer', 'code', 'data', 
  'server', 'network', 'cloud', 'mobile', 'atom',
  
  // Business & Finance
  'business', 'money', 'chart', 'growth', 'finance', 
  'payment', 'receipt', 'calculator',
  
  // Health & Wellness
  'health', 'medical', 'heart', 'fitness', 'running', 
  'swimming', 'cycling', 'sports',
  
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
 * Get a comma-separated list of available icons
 * @returns {string} Comma-separated list of icon keywords
 */
const getIconsList = () => AVAILABLE_ICONS.join(', ');

/**
 * Language instruction templates - EXTREMELY STRICT for Tunisian primary school children
 */
const LANGUAGE_INSTRUCTIONS = {
  ar: `!!!! EXTREMELY STRICT ARABIC-ONLY RULES !!!!

ZERO TOLERANCE FOR LATIN LETTERS:
- EVERY SINGLE CHARACTER in "text" and "title" fields MUST be Arabic script
- If you write even ONE Latin letter (a-z, A-Z), the output is REJECTED
- WRONG: "druba" or "Hannibal" or "Rome" 
- CORRECT: "دروبا" or "حنبعل" or "روما"

TRANSLITERATION EXAMPLES:
- Hannibal = حنبعل
- Carthage = قرطاج
- Rome = روما
- Italy = إيطاليا
- Alps = جبال الألب
- Scipio = سكيبيو
- Zama = زاما
- Trebia = تريبيا
- Cannae = كاناي

FOR CHILDREN (ages 6-12):
- Use SIMPLE words only
- Maximum 3-4 words per node
- Numbers: use 0-9 (NOT ٠١٢٣)

ONLY EXCEPTION: The "icon" field MUST be English (code keyword)`,
  
  fr: `!!!! EXTREMELY STRICT FRENCH-ONLY RULES !!!!
- ZERO Latin/English words allowed in text (except "icon" field)
- ALL proper nouns must be in French form
- Use SIMPLE vocabulary for children ages 6-12
- Maximum 3-4 words per node
- ONLY "icon" field can be in English`,
  
  en: `STRICT ENGLISH RULES FOR CHILDREN:
- Use SIMPLE vocabulary for children ages 6-12
- Maximum 3-4 words per node`
};

/**
 * Regex pattern to detect verb conjugation mode
 */
const VERB_KEYWORDS_PATTERN = /\b(verb|verbe|فعل|conjugat|conjuguer|تصريف)\b/i;

module.exports = {
  AVAILABLE_ICONS,
  getIconsList,
  LANGUAGE_INSTRUCTIONS,
  VERB_KEYWORDS_PATTERN
};
