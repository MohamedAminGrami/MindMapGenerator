/**
 * Icons8 3D Fluency Icon Map
 * 
 * Maps keyword strings to Icons8 3D Fluency icon URLs.
 * These are colorful 3D icons that are more visually appealing for children.
 * 
 * @module icons8Map
 */

// Base URL for Icons8 3D Fluency icons
const ICONS8_BASE = 'https://img.icons8.com/3d-fluency/94';

/**
 * Mapping of keyword strings to Icons8 3D Fluency icon names.
 * Organized by category for easy maintenance.
 */
const icons8Map = {
  // Education & Learning
  education: 'graduation-cap',
  book: 'book',
  study: 'open-book',
  school: 'school',
  graduation: 'diploma',
  
  // Science & Technology
  science: 'test-tube',
  technology: 'processor',
  computer: 'laptop',
  code: 'source-code',
  data: 'database',
  server: 'server',
  network: 'mind-map',
  cloud: 'cloud',
  mobile: 'smartphone',
  atom: 'atom',
  
  // Business & Finance
  business: 'briefcase',
  money: 'money',
  chart: 'combo-chart',
  growth: 'growing-plant',
  finance: 'piggy-bank',
  payment: 'credit-card',
  receipt: 'receipt',
  calculator: 'calculator',
  
  // Health & Wellness
  health: 'heart-with-pulse',
  medical: 'stethoscope',
  heart: 'heart',
  fitness: 'dumbbell',
  running: 'running',
  swimming: 'swimming',
  cycling: 'cycling',
  sports: 'soccer-ball',
  
  // Nature & Environment
  nature: 'deciduous-tree',
  plant: 'potted-plant',
  earth: 'globe-showing-americas',
  water: 'water',
  
  // Food & Drink
  food: 'hamburger',
  coffee: 'hot-beverage',
  fruit: 'red-apple',
  cooking: 'cooking',
  
  // Communication & Social
  communication: 'speech-bubble',
  social: 'conference',
  people: 'people',
  chat: 'envelope',
  language: 'language',
  global: 'globe',
  
  // Creative & Art
  art: 'palette',
  music: 'musical-notes',
  design: 'design',
  idea: 'light-bulb',
  film: 'clapperboard',
  camera: 'camera',
  writing: 'pen',
  gaming: 'game-controller',
  
  // Travel & Transport
  travel: 'luggage',
  plane: 'airplane',
  car: 'car',
  map: 'map',
  compass: 'compass',
  rocket: 'rocket',
  
  // Time & Calendar
  time: 'clock',
  calendar: 'calendar',
  history: 'clock--v2',
  
  // Security & Testing
  security: 'shield',
  bug: 'bug',
  testing: 'test-tube',
  lock: 'lock',
  
  // Buildings & Places
  home: 'home',
  building: 'building',
  city: 'city',
  warehouse: 'warehouse',
  
  // Legal & Government
  legal: 'law',
  justice: 'scales',
  government: 'bank-building',
  landmark: 'monument',
  
  // Brain & Strategy
  brain: 'brain',
  puzzle: 'puzzle',
  strategy: 'chess',
  blocks: 'brick',
  
  // Achievement & Recognition
  handshake: 'handshake',
  award: 'award',
  trophy: 'trophy',
  medal: 'medal',
  
  // Files & Organization
  file: 'document',
  folder: 'folder',
  clipboard: 'clipboard',
  tasks: 'checklist',
  search: 'search',
  filter: 'filter',
  sort: 'sort',
  list: 'bulleted-list',
  
  // General
  star: 'star',
  check: 'checkmark',
  warning: 'error',
  info: 'info',
  settings: 'settings',
  target: 'target',
  flag: 'flag',
  
  // War & History (for Hannibal-type topics)
  war: 'swords',
  battle: 'swords',
  army: 'conference',
  soldier: 'knight',
  sword: 'sword',
  elephant: 'elephant',
  mountain: 'mountain',
  victory: 'trophy',
  defeat: 'thumbs-down',
  king: 'crown',
  leader: 'crown',
  
  // Default
  default: 'bookmark'
};

/**
 * Get the Icons8 URL for a given keyword.
 * @param {string} keyword - The icon keyword from the AI response
 * @returns {string} Full URL to the Icons8 3D Fluency icon
 */
export const getIconUrl = (keyword) => {
  if (!keyword) return `${ICONS8_BASE}/${icons8Map.default}.png`;
  const key = keyword.toLowerCase().trim();
  const iconName = icons8Map[key] || icons8Map.default;
  return `${ICONS8_BASE}/${iconName}.png`;
};

/**
 * Get a comma-separated list of available icon keywords.
 * @returns {string} Comma-separated list of icon keywords
 */
export const getAvailableIcons = () => {
  return Object.keys(icons8Map).filter(k => k !== 'default').join(', ');
};

export default icons8Map;
