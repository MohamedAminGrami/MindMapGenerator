/**
 * Connection Utilities
 * 
 * Functions for calculating SVG connection paths between mind map nodes.
 * Supports both horizontal and vertical layouts.
 */

import { getBranchColor, BRANCH_COLORS } from '../constants';

/**
 * Calculate connection data for all branches in the mind map
 * 
 * @param {HTMLElement} container - The mindmap container element
 * @param {HTMLElement} center - The central node element
 * @param {Array} palette - Optional color palette to use for connections
 * @returns {Object} Object containing connections array and svg size
 */
export const calculateConnections = (container, center, palette = BRANCH_COLORS) => {
  if (!container || !center) return { connections: [], svgSize: { width: 0, height: 0 } };

  const containerRect = container.getBoundingClientRect();
  const centerRect = center.getBoundingClientRect();

  const svgSize = {
    width: containerRect.width,
    height: containerRect.height
  };

  const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
  const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;
  const centerRadius = centerRect.width / 2;

  const connections = [];

  // Get all branch groups
  const branchGroups = container.querySelectorAll('.branch-row');

  branchGroups.forEach((group) => {
    const branchNode = group.querySelector('.branch-node');
    const leafNodes = group.querySelectorAll('.leaf-node');
    const isLeft = group.classList.contains('branch-row-left');
    const isTop = group.classList.contains('branch-row-top');
    const isBottom = group.classList.contains('branch-row-bottom');
    const isVerticalLayout = isTop || isBottom;

    if (branchNode) {
      const branchRect = branchNode.getBoundingClientRect();
      const colorIndex = parseInt(branchNode.dataset.colorIndex || '0');
      const color = getBranchColor(colorIndex, palette);

      if (isVerticalLayout) {
        // VERTICAL LAYOUT: connections go up/down
        const branchConn = calculateVerticalBranchConnection(
          containerRect, centerX, centerY, centerRadius,
          branchRect, color, isTop
        );
        connections.push(branchConn);

        // Connections from branch to leaves (vertical)
        leafNodes.forEach((leaf) => {
          const leafConn = calculateVerticalLeafConnection(
            containerRect, branchRect, leaf.getBoundingClientRect(),
            color, isTop
          );
          connections.push(leafConn);
        });
      } else {
        // HORIZONTAL LAYOUT: connections go left/right
        const branchConn = calculateHorizontalBranchConnection(
          containerRect, centerX, centerY, centerRadius,
          branchRect, color, isLeft
        );
        connections.push(branchConn);

        // Connections from branch to leaves (horizontal)
        leafNodes.forEach((leaf) => {
          const leafConn = calculateHorizontalLeafConnection(
            containerRect, branchRect, leaf.getBoundingClientRect(),
            color, isLeft
          );
          connections.push(leafConn);
        });
      }
    }
  });

  return { connections, svgSize };
};

/**
 * Calculate connection from center to branch (vertical layout)
 */
const calculateVerticalBranchConnection = (containerRect, centerX, centerY, centerRadius, branchRect, color, isTop) => {
  const branchX = branchRect.left + branchRect.width / 2 - containerRect.left;
  const branchY = isTop
    ? branchRect.bottom - containerRect.top
    : branchRect.top - containerRect.top;
  const startY = isTop ? centerY - centerRadius : centerY + centerRadius;

  return {
    type: 'center-to-branch',
    startX: centerX,
    startY,
    endX: branchX,
    endY: branchY,
    color: color.bg,
    isVertical: true,
    isTop
  };
};

/**
 * Calculate connection from branch to leaf (vertical layout)
 */
const calculateVerticalLeafConnection = (containerRect, branchRect, leafRect, color, isTop) => {
  const leafX = leafRect.left + leafRect.width / 2 - containerRect.left;
  const leafY = isTop
    ? leafRect.bottom - containerRect.top
    : leafRect.top - containerRect.top;
  const branchStartX = branchRect.left + branchRect.width / 2 - containerRect.left;
  const branchStartY = isTop
    ? branchRect.top - containerRect.top
    : branchRect.bottom - containerRect.top;

  return {
    type: 'branch-to-leaf',
    startX: branchStartX,
    startY: branchStartY,
    endX: leafX,
    endY: leafY,
    color: color.bg,
    isVertical: true,
    isTop
  };
};

/**
 * Calculate connection from center to branch (horizontal layout)
 */
const calculateHorizontalBranchConnection = (containerRect, centerX, centerY, centerRadius, branchRect, color, isLeft) => {
  const branchX = isLeft
    ? branchRect.right - containerRect.left
    : branchRect.left - containerRect.left;
  const branchY = branchRect.top + branchRect.height / 2 - containerRect.top;
  const startX = isLeft ? centerX - centerRadius : centerX + centerRadius;

  return {
    type: 'center-to-branch',
    startX,
    startY: centerY,
    endX: branchX,
    endY: branchY,
    color: color.bg,
    isVertical: false,
    isLeft
  };
};

/**
 * Calculate connection from branch to leaf (horizontal layout)
 */
const calculateHorizontalLeafConnection = (containerRect, branchRect, leafRect, color, isLeft) => {
  const leafX = isLeft
    ? leafRect.right - containerRect.left
    : leafRect.left - containerRect.left;
  const leafY = leafRect.top + leafRect.height / 2 - containerRect.top;
  const branchStartX = isLeft
    ? branchRect.left - containerRect.left
    : branchRect.right - containerRect.left;
  const branchStartY = branchRect.top + branchRect.height / 2 - containerRect.top;

  return {
    type: 'branch-to-leaf',
    startX: branchStartX,
    startY: branchStartY,
    endX: leafX,
    endY: leafY,
    color: color.bg,
    isVertical: false,
    isLeft
  };
};

/**
 * Generate SVG path string for a connection
 * @param {Object} conn - Connection data object
 * @returns {string} SVG path 'd' attribute value
 */
export const generatePathD = (conn) => {
  if (conn.isVertical) {
    // VERTICAL CURVES: control points adjust Y axis
    const dy = conn.endY - conn.startY;
    const controlY1 = conn.startY + dy * 0.5;
    const controlY2 = conn.startY + dy * 0.5;
    return `M ${conn.startX},${conn.startY} C ${conn.startX},${controlY1} ${conn.endX},${controlY2} ${conn.endX},${conn.endY}`;
  }
  
  // HORIZONTAL CURVES: control points adjust X axis
  const dx = conn.endX - conn.startX;
  const controlX1 = conn.startX + dx * 0.4;
  const controlX2 = conn.startX + dx * 0.6;
  return `M ${conn.startX},${conn.startY} C ${controlX1},${conn.startY} ${controlX2},${conn.endY} ${conn.endX},${conn.endY}`;
};
