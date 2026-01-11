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
 * Get color for a branch by index
 * @param {number} index - Branch index
 * @returns {Object} Color scheme object
 */
export const getBranchColor = (index) => {
  return BRANCH_COLORS[index % BRANCH_COLORS.length];
};

export default BRANCH_COLORS;
