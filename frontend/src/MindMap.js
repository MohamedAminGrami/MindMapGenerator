import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import './MindMap.css';

const BRANCH_COLORS = [
  { bg: '#10B981', border: '#059669', text: '#FFFFFF', light: '#D1FAE5', arrow: '#10B981' }, // Green
  { bg: '#F97316', border: '#EA580C', text: '#FFFFFF', light: '#FFEDD5', arrow: '#F97316' }, // Orange
  { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF', light: '#DBEAFE', arrow: '#3B82F6' }, // Blue
  { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF', light: '#EDE9FE', arrow: '#8B5CF6' }, // Purple
  { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF', light: '#FCE7F3', arrow: '#EC4899' }, // Pink
  { bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF', light: '#CCFBF1', arrow: '#14B8A6' }, // Teal
];

const MindMap = ({ data }) => {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  
  const processedData = useMemo(() => {
    if (!data || !data.nodes) return null;
    
    const nodes = data.nodes;
    const leftNodes = [];
    const rightNodes = [];
    
    nodes.forEach((node, index) => {
      if (index % 2 === 0) {
        rightNodes.push({ ...node, colorIndex: index });
      } else {
        leftNodes.push({ ...node, colorIndex: index });
      }
    });
    
    return { title: data.title, leftNodes, rightNodes };
  }, [data]);

  // Calculate connection paths after render
  useLayoutEffect(() => {
    if (!containerRef.current || !centerRef.current || !processedData) return;

    const calculateConnections = () => {
      const container = containerRef.current;
      const center = centerRef.current;
      if (!container || !center) return;
      
      const containerRect = container.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();
      
      // Set SVG size
      setSvgSize({ 
        width: containerRect.width, 
        height: containerRect.height 
      });
      
      const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
      const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;
      const centerRadius = centerRect.width / 2;

      const newConnections = [];

      // Get all branch groups
      const branchGroups = container.querySelectorAll('.branch-row');

      branchGroups.forEach((group) => {
        const branchNode = group.querySelector('.branch-node');
        const leafNodes = group.querySelectorAll('.leaf-node');
        const isLeft = group.classList.contains('branch-row-left');
        
        if (branchNode) {
          const branchRect = branchNode.getBoundingClientRect();
          const branchX = isLeft 
            ? branchRect.right - containerRect.left
            : branchRect.left - containerRect.left;
          const branchY = branchRect.top + branchRect.height / 2 - containerRect.top;
          
          // Get color from data attribute or compute
          const colorIndex = parseInt(branchNode.dataset.colorIndex || '0');
          const color = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];
          
          // Connection from center to branch
          const startX = isLeft ? centerX - centerRadius : centerX + centerRadius;
          
          newConnections.push({
            type: 'center-to-branch',
            startX,
            startY: centerY,
            endX: branchX,
            endY: branchY,
            color: color.bg,
            isLeft
          });

          // Connections from branch to leaves
          leafNodes.forEach((leaf) => {
            const leafRect = leaf.getBoundingClientRect();
            const leafX = isLeft
              ? leafRect.right - containerRect.left
              : leafRect.left - containerRect.left;
            const leafY = leafRect.top + leafRect.height / 2 - containerRect.top;
            
            const branchEndX = isLeft
              ? branchRect.left - containerRect.left
              : branchRect.right - containerRect.left;

            newConnections.push({
              type: 'branch-to-leaf',
              startX: branchEndX,
              startY: branchY,
              endX: leafX,
              endY: leafY,
              color: color.bg,
              isLeft
            });
          });
        }
      });

      setConnections(newConnections);
    };

    // Calculate after DOM is ready
    const timer = setTimeout(calculateConnections, 150);
    
    // Also recalculate on window resize
    window.addEventListener('resize', calculateConnections);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateConnections);
    };
  }, [processedData]);

  if (!processedData) return null;

  const renderBranch = (node, index, side) => {
    const color = BRANCH_COLORS[node.colorIndex % BRANCH_COLORS.length];
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
          {node.emoji && <span className="branch-emoji">{node.emoji}</span>}
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
                {child.emoji && <span className="leaf-emoji">{child.emoji}</span>}
                <span className="leaf-text">{child.text || child.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mindmap-wrapper" ref={containerRef}>
      {/* SVG Layer for all connections */}
      <svg 
        className="connections-svg" 
        width={svgSize.width} 
        height={svgSize.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 5 }}
      >
        {connections.map((conn, idx) => {
          const dx = conn.endX - conn.startX;
          const controlX1 = conn.startX + dx * 0.4;
          const controlX2 = conn.startX + dx * 0.6;
          
          return (
            <path
              key={idx}
              d={`M ${conn.startX},${conn.startY} C ${controlX1},${conn.startY} ${controlX2},${conn.endY} ${conn.endX},${conn.endY}`}
              fill="none"
              stroke={conn.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Background Decorations */}
      <div className="mindmap-bg">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="bg-icon bg-icon-1">💡</div>
        <div className="bg-icon bg-icon-2">📚</div>
        <div className="bg-icon bg-icon-3">🔬</div>
        <div className="bg-icon bg-icon-4">✨</div>
      </div>
      
      <div className="mindmap-layout">
        {/* Left Side Branches */}
        <div className="branches-side branches-left">
          {processedData.leftNodes.map((node, index) => 
            renderBranch(node, index, 'left')
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
        
        {/* Right Side Branches */}
        <div className="branches-side branches-right">
          {processedData.rightNodes.map((node, index) => 
            renderBranch(node, index, 'right')
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;
