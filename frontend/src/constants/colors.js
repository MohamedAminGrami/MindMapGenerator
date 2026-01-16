/**
 * Branch Colors Constants
 * 
 * Color palette for mind map branches.
 * Each branch gets a unique color scheme with:
 * - bg: Main background color
 * - border: Darker border color
 * - text: Text color (white)
 * - light: Light background for leaf nodes
 * - arrow: Connection line color
 */

/**
 * Helper function to generate a lighter shade of a color for leaf nodes
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export const lightenColor = (hex, percent = 85) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * (percent / 100)));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * (percent / 100)));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * (percent / 100)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Helper function to generate a darker shade of a color for borders
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export const darkenColor = (hex, percent = 15) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Generate a full color scheme from a base color
 * @param {string} baseColor - Base hex color
 * @returns {Object} Full color scheme object
 */
export const generateColorScheme = (baseColor) => ({
  bg: baseColor,
  border: darkenColor(baseColor, 15),
  text: '#FFFFFF',
  light: lightenColor(baseColor, 85),
  arrow: baseColor,
});

// Default color palette
export const BRANCH_COLORS = [
  { bg: '#10B981', border: '#059669', text: '#FFFFFF', light: '#D1FAE5', arrow: '#10B981' }, // Green
  { bg: '#F97316', border: '#EA580C', text: '#FFFFFF', light: '#FFEDD5', arrow: '#F97316' }, // Orange
  { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF', light: '#DBEAFE', arrow: '#3B82F6' }, // Blue
  { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE', arrow: '#8B5CF6' }, // Purple
  { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF', light: '#FCE7F3', arrow: '#EC4899' }, // Pink
  { bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF', light: '#CCFBF1', arrow: '#14B8A6' }, // Teal
  { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF', light: '#FEE2E2', arrow: '#EF4444' }, // Red
  { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF', light: '#FEF3C7', arrow: '#F59E0B' }, // Amber
  { bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF', light: '#E0E7FF', arrow: '#6366F1' }, // Indigo
  { bg: '#84CC16', border: '#65A30D', text: '#FFFFFF', light: '#ECFCCB', arrow: '#84CC16' }, // Lime
];

/**
 * Predefined Color Palettes
 * Each palette contains a name, description, and array of colors
 */
export const COLOR_PALETTES = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Vibrant multi-color palette',
    colors: BRANCH_COLORS,
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue and teal tones',
    colors: [
      { bg: '#0EA5E9', border: '#0284C7', text: '#FFFFFF', light: '#E0F2FE', arrow: '#0EA5E9' },
      { bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF', light: '#CFFAFE', arrow: '#06B6D4' },
      { bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF', light: '#CCFBF1', arrow: '#14B8A6' },
      { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF', light: '#DBEAFE', arrow: '#3B82F6' },
      { bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF', light: '#E0E7FF', arrow: '#6366F1' },
      { bg: '#0891B2', border: '#0E7490', text: '#FFFFFF', light: '#CFFAFE', arrow: '#0891B2' },
      { bg: '#2DD4BF', border: '#14B8A6', text: '#FFFFFF', light: '#CCFBF1', arrow: '#2DD4BF' },
      { bg: '#38BDF8', border: '#0EA5E9', text: '#FFFFFF', light: '#E0F2FE', arrow: '#38BDF8' },
      { bg: '#818CF8', border: '#6366F1', text: '#FFFFFF', light: '#E0E7FF', arrow: '#818CF8' },
      { bg: '#22D3EE', border: '#06B6D4', text: '#FFFFFF', light: '#CFFAFE', arrow: '#22D3EE' },
    ],
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and red tones',
    colors: [
      { bg: '#F97316', border: '#EA580C', text: '#FFFFFF', light: '#FFEDD5', arrow: '#F97316' },
      { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF', light: '#FEE2E2', arrow: '#EF4444' },
      { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF', light: '#FEF3C7', arrow: '#F59E0B' },
      { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF', light: '#FCE7F3', arrow: '#EC4899' },
      { bg: '#FB923C', border: '#F97316', text: '#FFFFFF', light: '#FFEDD5', arrow: '#FB923C' },
      { bg: '#F87171', border: '#EF4444', text: '#FFFFFF', light: '#FEE2E2', arrow: '#F87171' },
      { bg: '#FBBF24', border: '#F59E0B', text: '#FFFFFF', light: '#FEF3C7', arrow: '#FBBF24' },
      { bg: '#F472B6', border: '#EC4899', text: '#FFFFFF', light: '#FCE7F3', arrow: '#F472B6' },
      { bg: '#E11D48', border: '#BE123C', text: '#FFFFFF', light: '#FFE4E6', arrow: '#E11D48' },
      { bg: '#EA580C', border: '#C2410C', text: '#FFFFFF', light: '#FFEDD5', arrow: '#EA580C' },
    ],
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones',
    colors: [
      { bg: '#10B981', border: '#059669', text: '#FFFFFF', light: '#D1FAE5', arrow: '#10B981' },
      { bg: '#84CC16', border: '#65A30D', text: '#FFFFFF', light: '#ECFCCB', arrow: '#84CC16' },
      { bg: '#22C55E', border: '#16A34A', text: '#FFFFFF', light: '#DCFCE7', arrow: '#22C55E' },
      { bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF', light: '#CCFBF1', arrow: '#14B8A6' },
      { bg: '#059669', border: '#047857', text: '#FFFFFF', light: '#D1FAE5', arrow: '#059669' },
      { bg: '#65A30D', border: '#4D7C0F', text: '#FFFFFF', light: '#ECFCCB', arrow: '#65A30D' },
      { bg: '#34D399', border: '#10B981', text: '#FFFFFF', light: '#D1FAE5', arrow: '#34D399' },
      { bg: '#A3E635', border: '#84CC16', text: '#1F2937', light: '#ECFCCB', arrow: '#A3E635' },
      { bg: '#4ADE80', border: '#22C55E', text: '#FFFFFF', light: '#DCFCE7', arrow: '#4ADE80' },
      { bg: '#2DD4BF', border: '#14B8A6', text: '#FFFFFF', light: '#CCFBF1', arrow: '#2DD4BF' },
    ],
  },
  purple: {
    id: 'purple',
    name: 'Purple Dream',
    description: 'Elegant purple and violet tones',
    colors: [
      { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE', arrow: '#8B5CF6' },
      { bg: '#A855F7', border: '#9333EA', text: '#FFFFFF', light: '#F3E8FF', arrow: '#A855F7' },
      { bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF', light: '#E0E7FF', arrow: '#6366F1' },
      { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF', light: '#FCE7F3', arrow: '#EC4899' },
      { bg: '#D946EF', border: '#C026D3', text: '#FFFFFF', light: '#FAE8FF', arrow: '#D946EF' },
      { bg: '#7C3AED', border: '#6D28D9', text: '#FFFFFF', light: '#EDE9FE', arrow: '#7C3AED' },
      { bg: '#C084FC', border: '#A855F7', text: '#FFFFFF', light: '#F3E8FF', arrow: '#C084FC' },
      { bg: '#818CF8', border: '#6366F1', text: '#FFFFFF', light: '#E0E7FF', arrow: '#818CF8' },
      { bg: '#F472B6', border: '#EC4899', text: '#FFFFFF', light: '#FCE7F3', arrow: '#F472B6' },
      { bg: '#E879F9', border: '#D946EF', text: '#FFFFFF', light: '#FAE8FF', arrow: '#E879F9' },
    ],
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean grayscale palette',
    colors: [
      { bg: '#374151', border: '#1F2937', text: '#FFFFFF', light: '#F3F4F6', arrow: '#374151' },
      { bg: '#4B5563', border: '#374151', text: '#FFFFFF', light: '#F3F4F6', arrow: '#4B5563' },
      { bg: '#6B7280', border: '#4B5563', text: '#FFFFFF', light: '#F9FAFB', arrow: '#6B7280' },
      { bg: '#1F2937', border: '#111827', text: '#FFFFFF', light: '#E5E7EB', arrow: '#1F2937' },
      { bg: '#9CA3AF', border: '#6B7280', text: '#1F2937', light: '#F9FAFB', arrow: '#9CA3AF' },
      { bg: '#334155', border: '#1E293B', text: '#FFFFFF', light: '#F1F5F9', arrow: '#334155' },
      { bg: '#475569', border: '#334155', text: '#FFFFFF', light: '#F1F5F9', arrow: '#475569' },
      { bg: '#64748B', border: '#475569', text: '#FFFFFF', light: '#F8FAFC', arrow: '#64748B' },
      { bg: '#0F172A', border: '#020617', text: '#FFFFFF', light: '#E2E8F0', arrow: '#0F172A' },
      { bg: '#94A3B8', border: '#64748B', text: '#1F2937', light: '#F8FAFC', arrow: '#94A3B8' },
    ],
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft and gentle colors',
    colors: [
      { bg: '#93C5FD', border: '#60A5FA', text: '#1E3A5F', light: '#EFF6FF', arrow: '#93C5FD' },
      { bg: '#86EFAC', border: '#4ADE80', text: '#14532D', light: '#F0FDF4', arrow: '#86EFAC' },
      { bg: '#FCA5A5', border: '#F87171', text: '#7F1D1D', light: '#FEF2F2', arrow: '#FCA5A5' },
      { bg: '#FCD34D', border: '#FBBF24', text: '#78350F', light: '#FFFBEB', arrow: '#FCD34D' },
      { bg: '#C4B5FD', border: '#A78BFA', text: '#4C1D95', light: '#F5F3FF', arrow: '#C4B5FD' },
      { bg: '#FBCFE8', border: '#F9A8D4', text: '#831843', light: '#FDF2F8', arrow: '#FBCFE8' },
      { bg: '#A5F3FC', border: '#67E8F9', text: '#164E63', light: '#ECFEFF', arrow: '#A5F3FC' },
      { bg: '#FED7AA', border: '#FDBA74', text: '#7C2D12', light: '#FFF7ED', arrow: '#FED7AA' },
      { bg: '#D9F99D', border: '#BEF264', text: '#365314', light: '#F7FEE7', arrow: '#D9F99D' },
      { bg: '#E9D5FF', border: '#D8B4FE', text: '#581C87', light: '#FAF5FF', arrow: '#E9D5FF' },
    ],
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Bright and electric colors',
    colors: [
      { bg: '#22D3EE', border: '#06B6D4', text: '#FFFFFF', light: '#CFFAFE', arrow: '#22D3EE' },
      { bg: '#A3E635', border: '#84CC16', text: '#1F2937', light: '#ECFCCB', arrow: '#A3E635' },
      { bg: '#F472B6', border: '#EC4899', text: '#FFFFFF', light: '#FCE7F3', arrow: '#F472B6' },
      { bg: '#FACC15', border: '#EAB308', text: '#1F2937', light: '#FEF9C3', arrow: '#FACC15' },
      { bg: '#E879F9', border: '#D946EF', text: '#FFFFFF', light: '#FAE8FF', arrow: '#E879F9' },
      { bg: '#4ADE80', border: '#22C55E', text: '#FFFFFF', light: '#DCFCE7', arrow: '#4ADE80' },
      { bg: '#38BDF8', border: '#0EA5E9', text: '#FFFFFF', light: '#E0F2FE', arrow: '#38BDF8' },
      { bg: '#FB923C', border: '#F97316', text: '#FFFFFF', light: '#FFEDD5', arrow: '#FB923C' },
      { bg: '#C084FC', border: '#A855F7', text: '#FFFFFF', light: '#F3E8FF', arrow: '#C084FC' },
      { bg: '#2DD4BF', border: '#14B8A6', text: '#FFFFFF', light: '#CCFBF1', arrow: '#2DD4BF' },
    ],
  },
};

/**
 * Get color for a branch by index using the specified palette
 * @param {number} index - Branch index
 * @param {Array} palette - Optional custom palette array
 * @returns {Object} Color scheme object
 */
export const getBranchColor = (index, palette = BRANCH_COLORS) => {
  return palette[index % palette.length];
};

/**
 * Get palette by ID
 * @param {string} paletteId - Palette ID
 * @returns {Object} Palette object
 */
export const getPaletteById = (paletteId) => {
  return COLOR_PALETTES[paletteId] || COLOR_PALETTES.default;
};

/**
 * Get all palette IDs
 * @returns {Array} Array of palette IDs
 */
export const getAllPaletteIds = () => Object.keys(COLOR_PALETTES);

export default BRANCH_COLORS;
