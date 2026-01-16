/**
 * ColorPaletteSelector Component
 * 
 * Allows users to:
 * - Select from predefined color palettes
 * - Create custom palettes with their own colors
 * - Preview palette colors before selection
 * 
 * @module ColorPaletteSelector
 */

import React, { useState, useEffect } from 'react';
import { COLOR_PALETTES, getAllPaletteIds, generateColorScheme } from '../constants/colors';
import './ColorPaletteSelector.css';

// Local storage key for custom palettes
const CUSTOM_PALETTES_KEY = 'mindmap-custom-palettes';

/**
 * Load custom palettes from localStorage
 * @returns {Object} Custom palettes object
 */
const loadCustomPalettes = () => {
  try {
    const stored = localStorage.getItem(CUSTOM_PALETTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Save custom palettes to localStorage
 * @param {Object} palettes - Custom palettes object
 */
const saveCustomPalettes = (palettes) => {
  try {
    localStorage.setItem(CUSTOM_PALETTES_KEY, JSON.stringify(palettes));
  } catch (e) {
    console.error('Failed to save custom palettes:', e);
  }
};

/**
 * ColorPaletteSelector Component
 * 
 * @param {string} selectedPaletteId - Currently selected palette ID
 * @param {Function} onPaletteChange - Callback when palette changes
 * @param {Array} customPalette - Custom palette colors (if any)
 * @param {Function} onCustomPaletteChange - Callback when custom palette changes
 */
const ColorPaletteSelector = ({ 
  selectedPaletteId, 
  onPaletteChange, 
  customPalette,
  onCustomPaletteChange 
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customPalettes, setCustomPalettes] = useState(loadCustomPalettes);
  const [editingColors, setEditingColors] = useState([
    '#10B981', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899',
    '#14B8A6', '#EF4444', '#F59E0B', '#6366F1', '#84CC16'
  ]);
  const [customPaletteName, setCustomPaletteName] = useState('');

  // Load custom palettes on mount
  useEffect(() => {
    setCustomPalettes(loadCustomPalettes());
  }, []);

  // Get all available palettes (predefined + custom)
  const allPalettes = {
    ...COLOR_PALETTES,
    ...customPalettes
  };

  /**
   * Handle palette selection
   * @param {string} paletteId - Selected palette ID
   */
  const handlePaletteSelect = (paletteId) => {
    onPaletteChange(paletteId);
    if (paletteId !== 'custom') {
      onCustomPaletteChange(null);
    }
  };

  /**
   * Handle color change in customizer
   * @param {number} index - Color index
   * @param {string} color - New color value
   */
  const handleColorChange = (index, color) => {
    const newColors = [...editingColors];
    newColors[index] = color;
    setEditingColors(newColors);
  };

  /**
   * Apply custom colors immediately
   */
  const applyCustomColors = () => {
    const customColors = editingColors.map(color => generateColorScheme(color));
    onCustomPaletteChange(customColors);
    onPaletteChange('custom');
  };

  /**
   * Save custom palette with a name
   */
  const saveCustomPalette = () => {
    if (!customPaletteName.trim()) {
      alert('Please enter a name for your palette');
      return;
    }

    const paletteId = `custom-${Date.now()}`;
    const newPalette = {
      id: paletteId,
      name: customPaletteName.trim(),
      description: 'Custom palette',
      isCustom: true,
      colors: editingColors.map(color => generateColorScheme(color))
    };

    const updatedPalettes = {
      ...customPalettes,
      [paletteId]: newPalette
    };

    setCustomPalettes(updatedPalettes);
    saveCustomPalettes(updatedPalettes);
    setCustomPaletteName('');
    
    // Select the new palette
    onPaletteChange(paletteId);
    onCustomPaletteChange(newPalette.colors);
  };

  /**
   * Delete a custom palette
   * @param {string} paletteId - Palette ID to delete
   */
  const deleteCustomPalette = (paletteId) => {
    const updatedPalettes = { ...customPalettes };
    delete updatedPalettes[paletteId];
    setCustomPalettes(updatedPalettes);
    saveCustomPalettes(updatedPalettes);
    
    // If the deleted palette was selected, switch to default
    if (selectedPaletteId === paletteId) {
      onPaletteChange('default');
      onCustomPaletteChange(null);
    }
  };

  /**
   * Load colors from a palette into the editor
   * @param {string} paletteId - Palette ID to load
   */
  const loadPaletteForEditing = (paletteId) => {
    const palette = allPalettes[paletteId];
    if (palette) {
      setEditingColors(palette.colors.slice(0, 10).map(c => c.bg));
    }
  };

  return (
    <div className="palette-selector">
      <div className="palette-selector-header">
        <label className="palette-label">🎨 Color Palette:</label>
        <button 
          className="customize-btn"
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          {showCustomizer ? '✕ Close' : '✨ Customize'}
        </button>
      </div>

      {/* Palette Options */}
      <div className="palette-options">
        {getAllPaletteIds().map(paletteId => {
          const palette = COLOR_PALETTES[paletteId];
          return (
            <button
              key={paletteId}
              className={`palette-btn ${selectedPaletteId === paletteId ? 'active' : ''}`}
              onClick={() => handlePaletteSelect(paletteId)}
              title={palette.description}
            >
              <div className="palette-preview">
                {palette.colors.slice(0, 5).map((color, idx) => (
                  <span 
                    key={idx} 
                    className="palette-color-dot"
                    style={{ backgroundColor: color.bg }}
                  />
                ))}
              </div>
              <span className="palette-name">{palette.name}</span>
            </button>
          );
        })}

        {/* Custom palettes */}
        {Object.keys(customPalettes).map(paletteId => {
          const palette = customPalettes[paletteId];
          return (
            <button
              key={paletteId}
              className={`palette-btn palette-btn-custom ${selectedPaletteId === paletteId ? 'active' : ''}`}
              onClick={() => handlePaletteSelect(paletteId)}
              title={palette.description}
            >
              <div className="palette-preview">
                {palette.colors.slice(0, 5).map((color, idx) => (
                  <span 
                    key={idx} 
                    className="palette-color-dot"
                    style={{ backgroundColor: color.bg }}
                  />
                ))}
              </div>
              <span className="palette-name">{palette.name}</span>
              <button 
                className="palette-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomPalette(paletteId);
                }}
                title="Delete palette"
              >
                🗑️
              </button>
            </button>
          );
        })}

        {/* Active custom palette indicator */}
        {selectedPaletteId === 'custom' && customPalette && (
          <button
            className="palette-btn active"
            onClick={() => setShowCustomizer(true)}
          >
            <div className="palette-preview">
              {customPalette.slice(0, 5).map((color, idx) => (
                <span 
                  key={idx} 
                  className="palette-color-dot"
                  style={{ backgroundColor: color.bg }}
                />
              ))}
            </div>
            <span className="palette-name">Current Custom</span>
          </button>
        )}
      </div>

      {/* Custom Palette Creator */}
      {showCustomizer && (
        <div className="palette-customizer">
          <h4 className="customizer-title">Create Your Palette</h4>
          
          {/* Quick load from existing palette */}
          <div className="customizer-load-section">
            <span className="customizer-load-label">Start from:</span>
            <select 
              className="customizer-load-select"
              onChange={(e) => loadPaletteForEditing(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select a palette...</option>
              {Object.entries(allPalettes).map(([id, palette]) => (
                <option key={id} value={id}>{palette.name}</option>
              ))}
            </select>
          </div>

          {/* Color inputs */}
          <div className="customizer-colors">
            {editingColors.map((color, index) => (
              <div key={index} className="customizer-color-item">
                <span className="color-number">{index + 1}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="color-hex-input"
                  placeholder="#000000"
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="customizer-actions">
            <button 
              className="apply-btn"
              onClick={applyCustomColors}
            >
              👁️ Preview
            </button>
            
            <div className="save-section">
              <input
                type="text"
                placeholder="Palette name..."
                value={customPaletteName}
                onChange={(e) => setCustomPaletteName(e.target.value)}
                className="palette-name-input"
              />
              <button 
                className="save-btn"
                onClick={saveCustomPalette}
                disabled={!customPaletteName.trim()}
              >
                💾 Save Palette
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteSelector;
