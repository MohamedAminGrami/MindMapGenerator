/**
 * MindMap Component
 * 
 * Renders an interactive mind map visualization with:
 * - Central node for the main topic
 * - Branch nodes distributed left and right (or top and bottom)
 * - Leaf nodes as children of branches
 * - SVG curved connection lines between nodes
 * - Color-coded branches with matching icons
 * 
 * @module MindMap
 */

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import './MindMap.css';

// Import from modular files
import { getBranchColor } from './constants';
import { calculateConnections, generatePathD } from './utils';
import { getIconUrl } from './icons8Map';

/**
 * NodeIcon Component
 * Renders a 3D Fluency icon from Icons8 based on the keyword from AI response.
 * 
 * @param {string} iconName - Icon keyword to look up
 * @param {string} className - CSS class for styling
 */
const NodeIcon = ({ iconName, className }) => {
  const iconUrl = getIconUrl(iconName);
  return <img src={iconUrl} alt="" className={className} />;
};

/**
 * MindMap Component
 * Main visualization component that renders the entire mind map.
 * Supports horizontal (left-center-right) and vertical (top-center-bottom) layouts.
 * 
 * @param {Object} data - Mind map data from AI
 * @param {string} data.title - Central topic title
 * @param {Array} data.nodes - Array of branch nodes with children
 * @param {string} layout - 'horizontal' or 'vertical'
 */
const MindMap = ({ data, layout = 'horizontal' }) => {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const isVertical = layout === 'vertical';
  
  /**
   * Process and distribute nodes between left/right or top/bottom sides.
   * Alternates nodes to balance the layout.
   */
  const processedData = useMemo(() => {
    if (!data || !data.nodes) return null;
    
    const nodes = data.nodes;
    const leftNodes = [];
    const rightNodes = [];
    
    // Alternate distribution: even indices go right, odd go left
    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        rightNodes.push({ ...node, colorIndex: index });
      } else {
        leftNodes.push({ ...node, colorIndex: index });
      }
    });
    
    return { title: data.title, leftNodes, rightNodes };
  }, [data]);

  /**
   * Calculate SVG connection paths between nodes.
   * Uses useLayoutEffect to measure DOM positions after render.
   * Recalculates on window resize.
   */
  useLayoutEffect(() => {
    if (!containerRef.current || !centerRef.current || !processedData) return;

    const updateConnections = () => {
      const result = calculateConnections(containerRef.current, centerRef.current);
      setConnections(result.connections);
      setSvgSize(result.svgSize);
    };

    // Calculate after DOM is ready (longer delay for layout changes)
    const timer = setTimeout(updateConnections, 200);
    
    // Also recalculate on window resize
    window.addEventListener('resize', updateConnections);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConnections);
    };
  }, [processedData, isVertical]);

  if (!processedData) return null;

  /**
   * Renders a branch node with its children (leaf nodes).
   * 
   * @param {Object} node - Branch node data
   * @param {number} index - Node index for keys
   * @param {string} side - 'left', 'right', 'top', or 'bottom' positioning
   */
  const renderBranch = (node, index, side) => {
    const color = getBranchColor(node.colorIndex);
    const children = node.children || [];
    
    return (
      <div key={index} className={`branch-row branch-row-${side}`}>
        {/* Branch Node */}
        <div 
          className="branch-node"
          data-color-index={node.colorIndex}
          style={{ 
            backgroundColor: color.bg,
            borderColor: color.border,
          }}
        >
          <NodeIcon iconName={node.icon} className="branch-icon" />
          <span className="branch-text">{node.text || node.label}</span>
        </div>
        
        {/* Children nodes */}
        {children.length > 0 && (
          <div className={`children-column children-column-${side}`}>
            {children.map((child, childIdx) => (
              <div 
                key={childIdx}
                className="leaf-node"
                style={{ 
                  backgroundColor: color.light,
                  borderColor: color.bg,
                }}
              >
                <NodeIcon iconName={child.icon} className="leaf-icon" />
                <span className="leaf-text">{child.text || child.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`mindmap-wrapper ${isVertical ? 'mindmap-vertical' : 'mindmap-horizontal'}`} ref={containerRef}>
      {/* SVG Layer for all connections (z-index: 1 to appear behind nodes) */}
      <svg 
        className="connections-svg" 
        width={svgSize.width} 
        height={svgSize.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}
      >
        {connections.map((conn, idx) => (
          <path
            key={idx}
            d={generatePathD(conn)}
            fill="none"
            stroke={conn.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Background Decorations */}
      <div className="mindmap-bg">
        <div className="bg-pattern"></div>
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>
      
      <div className={`mindmap-layout ${isVertical ? 'layout-vertical' : 'layout-horizontal'}`}>
        {/* Top/Left Side Branches */}
        <div className={`branches-side ${isVertical ? 'branches-top' : 'branches-left'}`}>
          {processedData.leftNodes.map((node, index) => 
            renderBranch(node, index, isVertical ? 'top' : 'left')
          )}
        </div>
        
        {/* Central Node */}
        <div className="central-node-wrapper" ref={centerRef}>
          <div className="central-node">
            <div className="central-glow"></div>
            <div className="central-content">
              <span className="central-icon">🧠</span>
              <span className="central-title">{processedData.title}</span>
            </div>
          </div>
        </div>
        
        {/* Bottom/Right Side Branches */}
        <div className={`branches-side ${isVertical ? 'branches-bottom' : 'branches-right'}`}>
          {processedData.rightNodes.map((node, index) => 
            renderBranch(node, index, isVertical ? 'bottom' : 'right')
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;
