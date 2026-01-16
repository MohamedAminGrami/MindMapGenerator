/**
 * ManualMindMapCreator Component
 * 
 * Allows users to manually create mind maps through a popup form.
 * Supports unlimited nodes and children with icon selection.
 */
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { 
  FaPlus, FaTimes, FaTrash, FaMagic, FaChevronDown, FaChevronUp,
  FaSitemap,
} from 'react-icons/fa';
import { getIcon } from '../../constants';
import './ManualMindMapCreator.css';

// Available icons for selection
const ICON_OPTIONS = [
  { value: 'default', label: 'Default', category: 'General' },
  { value: 'star', label: 'Star', category: 'General' },
  { value: 'check', label: 'Check', category: 'General' },
  { value: 'info', label: 'Info', category: 'General' },
  { value: 'target', label: 'Target', category: 'General' },
  { value: 'flag', label: 'Flag', category: 'General' },
  { value: 'education', label: 'Education', category: 'Education' },
  { value: 'book', label: 'Book', category: 'Education' },
  { value: 'study', label: 'Study', category: 'Education' },
  { value: 'science', label: 'Science', category: 'Science' },
  { value: 'technology', label: 'Technology', category: 'Science' },
  { value: 'code', label: 'Code', category: 'Science' },
  { value: 'data', label: 'Data', category: 'Science' },
  { value: 'atom', label: 'Atom', category: 'Science' },
  { value: 'business', label: 'Business', category: 'Business' },
  { value: 'money', label: 'Money', category: 'Business' },
  { value: 'chart', label: 'Chart', category: 'Business' },
  { value: 'growth', label: 'Growth', category: 'Business' },
  { value: 'health', label: 'Health', category: 'Health' },
  { value: 'heart', label: 'Heart', category: 'Health' },
  { value: 'fitness', label: 'Fitness', category: 'Health' },
  { value: 'nature', label: 'Nature', category: 'Nature' },
  { value: 'plant', label: 'Plant', category: 'Nature' },
  { value: 'earth', label: 'Earth', category: 'Nature' },
  { value: 'food', label: 'Food', category: 'Lifestyle' },
  { value: 'coffee', label: 'Coffee', category: 'Lifestyle' },
  { value: 'home', label: 'Home', category: 'Lifestyle' },
  { value: 'communication', label: 'Communication', category: 'Social' },
  { value: 'social', label: 'Social', category: 'Social' },
  { value: 'people', label: 'People', category: 'Social' },
  { value: 'art', label: 'Art', category: 'Creative' },
  { value: 'music', label: 'Music', category: 'Creative' },
  { value: 'idea', label: 'Idea', category: 'Creative' },
  { value: 'travel', label: 'Travel', category: 'Travel' },
  { value: 'plane', label: 'Plane', category: 'Travel' },
  { value: 'map', label: 'Map', category: 'Travel' },
  { value: 'rocket', label: 'Rocket', category: 'Travel' },
  { value: 'time', label: 'Time', category: 'Time' },
  { value: 'calendar', label: 'Calendar', category: 'Time' },
  { value: 'history', label: 'History', category: 'Time' },
  { value: 'brain', label: 'Brain', category: 'Strategy' },
  { value: 'puzzle', label: 'Puzzle', category: 'Strategy' },
  { value: 'strategy', label: 'Strategy', category: 'Strategy' },
  { value: 'trophy', label: 'Trophy', category: 'Achievement' },
  { value: 'award', label: 'Award', category: 'Achievement' },
  { value: 'medal', label: 'Medal', category: 'Achievement' },
  { value: 'file', label: 'File', category: 'Organization' },
  { value: 'folder', label: 'Folder', category: 'Organization' },
  { value: 'tasks', label: 'Tasks', category: 'Organization' },
  { value: 'list', label: 'List', category: 'Organization' },
];

// Icon selector component
const IconSelector = ({ value, onChange }) => {
  const IconComponent = getIcon(value);
  
  return (
    <div className="icon-selector">
      <div className="icon-preview">
        <IconComponent />
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {ICON_OPTIONS.map(icon => (
          <option key={icon.value} value={icon.value}>
            {icon.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Child item component
const ChildItem = ({ child, index, onUpdate, onRemove }) => {
  return (
    <div className="child-item">
      <div className="child-inputs">
        <input
          type="text"
          placeholder="Child text..."
          value={child.text}
          onChange={(e) => onUpdate(index, { ...child, text: e.target.value })}
          className="child-text-input"
        />
        <IconSelector 
          value={child.icon} 
          onChange={(icon) => onUpdate(index, { ...child, icon })}
        />
        <button 
          type="button" 
          className="remove-btn small"
          onClick={() => onRemove(index)}
          title="Remove child"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

// Node item component
const NodeItem = ({ node, index, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(true);
  
  const addChild = () => {
    const newChildren = [...(node.children || []), { text: '', icon: 'default' }];
    onUpdate(index, { ...node, children: newChildren });
  };
  
  const updateChild = (childIndex, updatedChild) => {
    const newChildren = [...node.children];
    newChildren[childIndex] = updatedChild;
    onUpdate(index, { ...node, children: newChildren });
  };
  
  const removeChild = (childIndex) => {
    const newChildren = node.children.filter((_, i) => i !== childIndex);
    onUpdate(index, { ...node, children: newChildren });
  };
  
  return (
    <div className="node-item">
      <div className="node-header">
        <div className="node-number">Node {index + 1}</div>
        <button 
          type="button"
          className="toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <button 
          type="button" 
          className="remove-btn"
          onClick={() => onRemove(index)}
          title="Remove node"
        >
          <FaTrash />
        </button>
      </div>
      
      {expanded && (
        <div className="node-content">
          <div className="node-main-inputs">
            <input
              type="text"
              placeholder="Node text (e.g., Main Topic)..."
              value={node.text}
              onChange={(e) => onUpdate(index, { ...node, text: e.target.value })}
              className="node-text-input"
            />
            <IconSelector 
              value={node.icon} 
              onChange={(icon) => onUpdate(index, { ...node, icon })}
            />
          </div>
          
          <div className="children-section">
            <div className="children-header">
              <span className="children-label">Children ({node.children?.length || 0})</span>
              <button 
                type="button" 
                className="add-child-btn"
                onClick={addChild}
              >
                <FaPlus /> Add Child
              </button>
            </div>
            
            <div className="children-list">
              {node.children?.map((child, childIndex) => (
                <ChildItem
                  key={childIndex}
                  child={child}
                  index={childIndex}
                  onUpdate={updateChild}
                  onRemove={removeChild}
                />
              ))}
              {(!node.children || node.children.length === 0) && (
                <div className="no-children">No children yet. Click "Add Child" to add sub-items.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const ManualMindMapCreator = ({ onMindMapData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [nodes, setNodes] = useState([
    { text: '', icon: 'default', children: [] }
  ]);
  const [error, setError] = useState('');
  
  const openModal = () => {
    setIsOpen(true);
    setError('');
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setError('');
  };
  
  const resetForm = () => {
    setTitle('');
    setNodes([{ text: '', icon: 'default', children: [] }]);
    setError('');
  };
  
  const addNode = () => {
    setNodes([...nodes, { text: '', icon: 'default', children: [] }]);
  };
  
  const updateNode = (index, updatedNode) => {
    const newNodes = [...nodes];
    newNodes[index] = updatedNode;
    setNodes(newNodes);
  };
  
  const removeNode = (index) => {
    if (nodes.length > 1) {
      setNodes(nodes.filter((_, i) => i !== index));
    }
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      setError('Please enter a title for your mind map.');
      return false;
    }
    
    const validNodes = nodes.filter(n => n.text.trim());
    if (validNodes.length === 0) {
      setError('Please add at least one node with text.');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Build the mind map data structure
    const mindmapData = {
      title: title.trim(),
      nodes: nodes
        .filter(node => node.text.trim())
        .map(node => ({
          text: node.text.trim(),
          icon: node.icon || 'default',
          children: (node.children || [])
            .filter(child => child.text.trim())
            .map(child => ({
              text: child.text.trim(),
              icon: child.icon || 'default'
            }))
        }))
    };
    
    console.log('Manual Mind Map Data:', mindmapData);
    
    // Pass to parent component
    onMindMapData(mindmapData);
    
    // Close modal and reset
    closeModal();
    resetForm();
  };
  
  return (
    <>
      {/* Trigger Button */}
      <button 
        type="button" 
        className="manual-create-btn"
        onClick={openModal}
      >
        <FaMagic /> Create Manually
      </button>
      
      {/* Modal Overlay */}
      {isOpen && (
        <div className="manual-modal-overlay" onClick={closeModal}>
          <div className="manual-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaSitemap /> Create Mind Map</h2>
              <button type="button" className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="manual-form">
              {/* Title Input */}
              <div className="form-section">
                <label className="section-label">Mind Map Title *</label>
                <input
                  type="text"
                  placeholder="Enter your mind map title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="title-input"
                  autoFocus
                />
              </div>
              
              {/* Nodes Section */}
              <div className="form-section nodes-section">
                <div className="section-header">
                  <label className="section-label">Nodes ({nodes.length})</label>
                  <button 
                    type="button" 
                    className="add-node-btn"
                    onClick={addNode}
                  >
                    <FaPlus /> Add Node
                  </button>
                </div>
                
                <div className="nodes-list">
                  {nodes.map((node, index) => (
                    <NodeItem
                      key={index}
                      node={node}
                      index={index}
                      onUpdate={updateNode}
                      onRemove={removeNode}
                    />
                  ))}
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="reset-btn" onClick={resetForm}>
                  Reset
                </button>
                <button type="submit" className="submit-btn">
                  <FaSitemap /> Generate Mind Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManualMindMapCreator;
