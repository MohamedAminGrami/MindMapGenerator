/**
 * Icon Map Module
 * 
 * Maps keyword strings to Font Awesome react-icons components.
 * Used by the MindMap component to render icons based on AI-generated keywords.
 * 
 * @module iconMap
 */

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

import { GiElephant, GiSwordman, GiCrossedSwords, GiCastle } from 'react-icons/gi';

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
  
  // General
  star: FaStar,
  check: FaCheckCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
  settings: FaCog,
  target: FaBullseye,
  flag: FaFlag,
  
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
 * Get a comma-separated list of available icon keywords.
 * Used to inform the AI about valid icon options.
 * @returns {string} Comma-separated list of icon keywords
 */
export const getAvailableIcons = () => {
  return Object.keys(iconMap).filter(k => k !== 'default').join(', ');
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

export default iconMap;
