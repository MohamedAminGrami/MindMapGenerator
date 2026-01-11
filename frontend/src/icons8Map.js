/**
 * Icons8 3D Fluency Icon Map
 * 
 * Maps keyword strings to Icons8 3D Fluency icon URLs.
 * Beautiful 3D icons perfect for children's educational content.
 * 
 * Icon source: https://icons8.com/icons/set/3d-fluency
 * CDN format: https://img.icons8.com/3d-fluency/94/{icon-name}.png
 * 
 * @module icons8Map
 */

// Base URL for Icons8 3D Fluency icons (94px size for quality)
const ICONS8_BASE = 'https://img.icons8.com/3d-fluency/94';

/**
 * Verified icon name mappings for Icons8 3D Fluency collection.
 * Each value is tested to work with the Icons8 CDN.
 */
const icons8Map = {
  // Education & Learning
  education: 'graduation-cap',
  book: 'book',
  study: 'open-book',
  school: 'school',
  graduation: 'diploma-1',
  
  // Science & Technology
  science: 'test-tube',
  technology: 'processor',
  computer: 'laptop',
  code: 'source-code',
  data: 'database',
  server: 'server',
  network: 'topology',
  cloud: 'cloud',
  mobile: 'iphone-14',
  atom: 'physics',
  
  // Business & Finance
  business: 'briefcase',
  money: 'money-bag',
  chart: 'combo-chart',
  growth: 'growing-money',
  finance: 'piggy-bank',
  payment: 'credit-card',
  receipt: 'receipt',
  calculator: 'calculator',
  
  // Health & Wellness
  health: 'heart-with-pulse',
  medical: 'stethoscope',
  heart: 'growing-heart',
  fitness: 'dumbbell',
  running: 'treadmill',
  swimming: 'swimming',
  cycling: 'cycling',
  sports: 'soccer-ball',
  
  // Nature & Environment
  nature: 'natural-food',
  plant: 'sunflower',
  earth: 'earth-planet',
  water: 'water-element',
  mountain: 'fuji-mountain',
  
  // Food & Drink
  food: 'kawaii-french-fries',
  coffee: 'espresso-cup',
  fruit: 'apple',
  cooking: 'cooker',
  
  // Communication & Social
  communication: 'topic',
  social: 'people-working-together',
  people: 'conference',
  chat: 'topic',
  language: 'language',
  global: 'globe',
  
  // Creative & Art
  art: 'paint-palette',
  music: 'itunes',
  design: 'design',
  idea: 'idea',
  film: 'clapperboard',
  camera: 'camera',
  writing: 'pencil',
  gaming: 'game-controller',
  
  // Travel & Transport
  travel: 'around-the-globe',
  plane: 'airplane-take-off',
  car: 'car',
  map: 'world-map',
  compass: 'compass',
  rocket: 'rocket',
  
  // Time & Calendar
  time: 'clock',
  calendar: 'calendar-3',
  history: 'overtime',
  
  // Security & Testing
  security: 'shield',
  bug: 'bug',
  testing: 'test-tube',
  lock: 'lock',
  
  // Buildings & Places
  home: 'home',
  building: 'organization',
  city: 'city',
  warehouse: 'warehouse',
  castle: 'castle',
  
  // Legal & Government
  legal: 'law',
  justice: 'scales',
  government: 'bank-building',
  landmark: 'organization',
  
  // Brain & Strategy
  brain: 'brain',
  puzzle: 'puzzle',
  strategy: 'chess',
  blocks: 'lego',
  
  // Achievement & Recognition
  handshake: 'handshake',
  award: 'diploma-1',
  trophy: 'trophy',
  medal: 'medal-first-place',
  victory: 'trophy',
  
  // Files & Organization
  file: 'document',
  folder: 'folder',
  clipboard: 'clipboard',
  tasks: 'tasklist',
  search: 'search',
  filter: 'filter',
  sort: 'sorting-arrows',
  list: 'todo-list',
  
  // War & History (for historical figures like Hannibal)
  war: 'armored-knight',
  battle: 'armored-knight',
  army: 'conference',
  soldier: 'armored-knight',
  sword: 'armored-knight',
  elephant: 'elephant',
  king: 'crown',
  leader: 'crown',
  power: 'strength',
  defeat: 'very-sad',
  
  // General
  star: 'star',
  check: 'checkmark',
  warning: 'error',
  info: 'info',
  settings: 'settings',
  target: 'goal',
  flag: 'flag-2',
  
  // Default fallback
  default: 'bookmark-ribbon'
};

/**
 * Get the Icons8 CDN URL for a given keyword.
 * @param {string} keyword - The icon keyword from the AI response
 * @returns {string} Full URL to the Icons8 3D Fluency icon PNG
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
