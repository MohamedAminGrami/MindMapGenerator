/**
 * Icons Module
 * 
 * Consolidated module combining both Font Awesome and Icons8 3D Fluency icon maps.
 * Provides a unified interface for accessing different icon sets.
 * 
 * @module icons
 */

// Import all Font Awesome icons (some intentionally unused for future expansion)
/* eslint-disable no-unused-vars */
import {
  FaGraduationCap, FaBook, FaBookOpen, FaSchool, FaScroll,
  FaFlask, FaMicrochip, FaLaptop, FaCode, FaDatabase,
  FaBriefcase, FaMoneyBillWave, FaChartLine, FaSeedling,
  FaHeartbeat, FaStethoscope, FaHeart, FaDumbbell,
  FaTree, FaLeaf, FaGlobeAmericas, FaTint,
  FaHamburger, FaCoffee, FaAppleAlt, FaUtensils,
  FaComments, FaUsers, FaUserFriends, FaEnvelope,
  FaPalette, FaMusic, FaPencilAlt, FaLightbulb,
  FaSuitcase, FaPlane, FaCar, FaMapMarkedAlt,
  FaClock, FaCalendarAlt, FaHistory,
  FaStar, FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaCog, FaBullseye, FaBookmark,
  FaShieldAlt, FaBug, FaVial, FaLock,
  FaServer, FaNetworkWired, FaCloud, FaMobile,
  FaGamepad, FaFilm, FaCamera, FaPen,
  FaHome, FaBuilding, FaCity, FaWarehouse,
  FaRunning, FaSwimmer, FaBicycle, FaFootballBall,
  FaLanguage, FaGlobe, FaFlag, FaCompass,
  FaRocket, FaAtom,
  FaPiggyBank, FaCreditCard, FaReceipt, FaCalculator,
  FaGavel, FaBalanceScale, FaUniversity, FaLandmark,
  FaBrain, FaPuzzlePiece, FaChess, FaCubes,
  FaHandshake, FaAward, FaTrophy, FaMedal,
  FaFileAlt, FaFolder, FaClipboard, FaTasks,
  FaSearch, FaFilter, FaSort, FaList,
  FaFistRaised, FaCrown, FaMountain, FaSkull, FaThumbsDown, FaThumbsUp
} from 'react-icons/fa';
/* eslint-enable no-unused-vars */

import { GiElephant, GiSwordman, GiCrossedSwords, GiCastle } from 'react-icons/gi';

/**
 * Icons8 3D Fluency Icon Map
 * 
 * Maps keyword strings to Icons8 3D Fluency icon URLs.
 * Beautiful 3D icons perfect for children's educational content.
 * 
 * Icon source: https://icons8.com/icons/set/3d-fluency
 * CDN format: https://img.icons8.com/3d-fluency/94/{icon-name}.png
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
 * Mapping of keyword strings to Font Awesome icon components.
 * Organized by category for easy maintenance.
 */
const iconMap = {
  // Education & Learning
  education: FaGraduationCap,
  book: FaBook,
  study: FaBookOpen,
  school: FaSchool,
  graduation: FaScroll,
  
  // Science & Technology
  science: FaFlask,
  technology: FaMicrochip,
  computer: FaLaptop,
  code: FaCode,
  data: FaDatabase,
  server: FaServer,
  network: FaNetworkWired,
  cloud: FaCloud,
  mobile: FaMobile,
  atom: FaAtom,
  
  // Business & Finance
  business: FaBriefcase,
  money: FaMoneyBillWave,
  chart: FaChartLine,
  growth: FaSeedling,
  finance: FaPiggyBank,
  payment: FaCreditCard,
  receipt: FaReceipt,
  calculator: FaCalculator,
  
  // Health & Wellness
  health: FaHeartbeat,
  medical: FaStethoscope,
  heart: FaHeart,
  fitness: FaDumbbell,
  running: FaRunning,
  swimming: FaSwimmer,
  cycling: FaBicycle,
  sports: FaFootballBall,
  
  // Nature & Environment
  nature: FaTree,
  plant: FaLeaf,
  earth: FaGlobeAmericas,
  water: FaTint,
  
  // Food & Drink
  food: FaHamburger,
  coffee: FaCoffee,
  fruit: FaAppleAlt,
  cooking: FaUtensils,
  
  // Communication & Social
  communication: FaComments,
  social: FaUsers,
  people: FaUserFriends,
  chat: FaEnvelope,
  language: FaLanguage,
  global: FaGlobe,
  
  // Creative & Art
  art: FaPalette,
  music: FaMusic,
  design: FaPencilAlt,
  idea: FaLightbulb,
  film: FaFilm,
  camera: FaCamera,
  writing: FaPen,
  gaming: FaGamepad,
  
  // Travel & Transport
  travel: FaSuitcase,
  plane: FaPlane,
  car: FaCar,
  map: FaMapMarkedAlt,
  compass: FaCompass,
  rocket: FaRocket,
  
  // Time & Calendar
  time: FaClock,
  calendar: FaCalendarAlt,
  history: FaHistory,
  
  // Security & Testing
  security: FaShieldAlt,
  bug: FaBug,
  testing: FaVial,
  lock: FaLock,
  
  // Buildings & Places
  home: FaHome,
  building: FaBuilding,
  city: FaCity,
  warehouse: FaWarehouse,
  
  // Legal & Government
  legal: FaGavel,
  justice: FaBalanceScale,
  government: FaUniversity,
  landmark: FaLandmark,
  
  // Brain & Strategy
  brain: FaBrain,
  puzzle: FaPuzzlePiece,
  strategy: FaChess,
  blocks: FaCubes,
  
  // Achievement & Recognition
  handshake: FaHandshake,
  award: FaAward,
  trophy: FaTrophy,
  medal: FaMedal,
  
  // Files & Organization
  file: FaFileAlt,
  folder: FaFolder,
  clipboard: FaClipboard,
  tasks: FaTasks,
  search: FaSearch,
  filter: FaFilter,
  sort: FaSort,
  list: FaList,
  
  // War & History
  war: GiCrossedSwords,
  battle: GiCrossedSwords,
  army: FaUsers,
  soldier: GiSwordman,
  sword: GiCrossedSwords,
  elephant: GiElephant,
  mountain: FaMountain,
  victory: FaTrophy,
  defeat: FaThumbsDown,
  king: FaCrown,
  leader: FaCrown,
  castle: GiCastle,
  power: FaFistRaised,
  
  default: FaBookmark
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
 * Get a comma-separated list of available Icons8 icon keywords.
 * @returns {string} Comma-separated list of icon keywords
 */
export const getAvailableIcons8Icons = () => {
  return Object.keys(icons8Map).filter(k => k !== 'default').join(', ');
};

/**
 * Get the icon component for a given keyword.
 * @param {string} keyword - The icon keyword from the AI response
 * @returns {React.ComponentType} Font Awesome icon component
 */
export const getIcon = (keyword) => {
  if (!keyword) return iconMap.default;
  const key = keyword.toLowerCase().trim();
  return iconMap[key] || iconMap.default;
};

/**
 * Get a comma-separated list of available Font Awesome icon keywords.
 * @returns {string} Comma-separated list of icon keywords
 */
export const getAvailableFontAwesomeIcons = () => {
  return Object.keys(iconMap).filter(k => k !== 'default').join(', ');
};

export default {
  getIcon,
  getIconUrl,
  getAvailableFontAwesomeIcons,
  getAvailableIcons8Icons,
};
