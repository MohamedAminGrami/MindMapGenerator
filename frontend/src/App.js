import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import MindMap from './MindMap';
import ColorPaletteSelector from './components/ColorPaletteSelector';
import FileMindMapUploader from './components/FileMindMapUploader';
import ManualMindMapCreator from './components/ManualMindMapCreator';
import { getPaletteById } from './constants/colors';
import './App.css';

// API URL from environment variable (defaults to localhost for development)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('en');
  const [layout, setLayout] = useState('horizontal'); // 'horizontal' or 'vertical'
  const [mindmapData, setMindmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPaletteId, setSelectedPaletteId] = useState('default');
  const [customPalette, setCustomPalette] = useState(null);
  const mindmapRef = useRef(null);

  // Get current palette colors
  const currentPaletteColors = customPalette || getPaletteById(selectedPaletteId).colors;

  const generateMindMap = async () => {
    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/generate-mindmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, language })
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate mind map');
      }
      
      const data = await res.json();
      setMindmapData(data.mindmapData);
    } catch (err) {
      setError(err.message || 'Error generating mind map');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Converts an external image URL to a base64 data URL.
   * This is needed because html-to-image cannot access cross-origin images.
   * 
   * @param {string} url - External image URL
   * @returns {Promise<string>} Base64 data URL or fallback
   */
  const convertImageToDataUrl = async (url) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(''); // Return empty on error
        reader.readAsDataURL(blob);
      });
    } catch {
      return ''; // Return empty on fetch error
    }
  };

  /**
   * Pre-processes images in the mindmap wrapper to convert external URLs to data URLs.
   * This prevents CORS errors during html-to-image export.
   * 
   * @param {HTMLElement} wrapper - The mindmap wrapper element
   * @returns {Promise<Map>} Map of original src to data URL for restoration
   */
  const preProcessImages = async (wrapper) => {
    const images = wrapper.querySelectorAll('img');
    const originalSrcs = new Map();
    
    const promises = Array.from(images).map(async (img) => {
      const src = img.src;
      if (src && src.startsWith('http')) {
        originalSrcs.set(img, src);
        const dataUrl = await convertImageToDataUrl(src);
        if (dataUrl) {
          img.src = dataUrl;
        } else {
          // Hide image if conversion failed
          img.style.visibility = 'hidden';
        }
      }
    });
    
    await Promise.all(promises);
    return originalSrcs;
  };

  /**
   * Restores original image sources after export.
   * 
   * @param {Map} originalSrcs - Map of images to their original sources
   */
  const restoreImages = (originalSrcs) => {
    originalSrcs.forEach((src, img) => {
      img.src = src;
      img.style.visibility = '';
    });
  };

  /**
   * Downloads the mind map as a PNG image.
   * 
   * Uses html-to-image (dom-to-image fork) which works by:
   * 1. Serializing the DOM tree to an XML string
   * 2. Inlining all computed CSS styles into the elements
   * 3. Converting external resources (fonts, images) to data URLs
   * 4. Creating an SVG with a <foreignObject> containing the HTML
   * 5. Drawing that SVG to a canvas and exporting as PNG
   * 
   * This is NOT a pixel screenshot - it's a true DOM-to-SVG-to-Canvas render.
   * Only captures the .mindmap-wrapper element (connections-svg, mindmap-bg, mindmap-layout).
   */
  const downloadMindMap = async () => {
    if (!mindmapRef.current) return;
    
    setDownloading(true);
    let originalSrcs = new Map();
    let mindmapWrapper = null;
    
    try {
      // Target ONLY the mindmap-wrapper div which contains:
      // - connections-svg (SVG curved lines)
      // - mindmap-bg (background decorations)
      // - mindmap-layout (central node + branches + leaves)
      mindmapWrapper = mindmapRef.current.querySelector('.mindmap-wrapper');
      
      if (!mindmapWrapper) {
        throw new Error('Mind map element not found');
      }
      
      // Pre-process: Convert external images to data URLs to avoid CORS errors
      setError(''); // Clear any previous errors
      originalSrcs = await preProcessImages(mindmapWrapper);
      
      // Wait for any CSS animations to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get the actual rendered dimensions of the mindmap
      const rect = mindmapWrapper.getBoundingClientRect();
      const width = Math.max(rect.width, mindmapWrapper.scrollWidth, 800);
      const height = Math.max(rect.height, mindmapWrapper.scrollHeight, 500);
      
      // Generate PNG using DOM serialization (not pixel capture)
      // html-to-image serializes styles inline and renders via SVG foreignObject
      const dataUrl = await toPng(mindmapWrapper, {
        quality: 1,
        pixelRatio: 2, // 2x resolution for crisp output
        backgroundColor: null, // Use the element's own background
        width: width,
        height: height,
        cacheBust: true,
        skipAutoScale: true,
        // Provide a transparent placeholder for any remaining failed images
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        style: {
          // Ensure content isn't clipped during export
          overflow: 'visible',
        }
      });
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `mindmap-${(mindmapData?.title || subject || 'export').replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download mindmap:', err);
      setError('Failed to download mind map. Please try again.');
    } finally {
      // Restore original image sources
      if (originalSrcs.size > 0) {
        restoreImages(originalSrcs);
      }
      setDownloading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-decoration-1" />
      <div className="bg-decoration-2" />

      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="badge">
            <span className="badge-text">✨ Visualization ✨</span>
          </div>
          <h1 className="title">Mind Map Generator</h1>
          <p className="subtitle">
            Transform any topic into beautiful, interactive mind maps
          </p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <label className="input-label">What would you like to explore?</label>
          
          <div className="language-selector">
            <label className="language-label">Output Language:</label>
            <div className="language-options">
              <button 
                className={`language-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button 
                className={`language-btn ${language === 'fr' ? 'active' : ''}`}
                onClick={() => setLanguage('fr')}
              >
                Français
              </button>
              <button 
                className={`language-btn ${language === 'ar' ? 'active' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                العربية
              </button>
            </div>
          </div>

          <div className="layout-selector">
            <label className="layout-label">Layout:</label>
            <div className="layout-options">
              <button 
                className={`layout-btn ${layout === 'horizontal' ? 'active' : ''}`}
                onClick={() => setLayout('horizontal')}
                title="Horizontal Layout"
              >
                ↔️ Horizontal
              </button>
              <button 
                className={`layout-btn ${layout === 'vertical' ? 'active' : ''}`}
                onClick={() => setLayout('vertical')}
                title="Vertical Layout"
              >
                ↕️ Vertical
              </button>
            </div>
          </div>

          {/* Color Palette Selector */}
          <ColorPaletteSelector
            selectedPaletteId={selectedPaletteId}
            onPaletteChange={setSelectedPaletteId}
            customPalette={customPalette}
            onCustomPaletteChange={setCustomPalette}
          />

          {/* Alternative Creation Options */}
          <div className="creation-options">
            <FileMindMapUploader onMindMapData={setMindmapData} />
            <div className="creation-divider">
              <span>OR</span>
            </div>
            <ManualMindMapCreator onMindMapData={setMindmapData} />
          </div>
          
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter a topic... (e.g., Quantum Physics, Ancient Rome, Machine Learning)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateMindMap()}
              disabled={loading}
              className="input-field"
            />
            <button
              onClick={generateMindMap}
              disabled={loading}
              className="generate-button"
            >
              {loading ? (
                <span>⏳ Generating...</span>
              ) : (
                <span>Generate Map</span>
              )}
            </button>
          </div>

          <p className="input-hint">
            Press Enter or click the button to generate your mind map
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Mind Map Display */}
        {mindmapData && (
          <div className="mindmap-container">
            <div className="mindmap-header">
              <h2 className="mindmap-title">{mindmapData.title || subject}</h2>
              <button
                onClick={downloadMindMap}
                disabled={downloading}
                className="download-button"
              >
                {downloading ? (
                  <span>⏳ Downloading...</span>
                ) : (
                  <span>📥 Download PNG</span>
                )}
              </button>
            </div>
            <div className="mindmap-display" ref={mindmapRef}>
              <MindMap data={mindmapData} layout={layout} palette={currentPaletteColors} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!mindmapData && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">🗺️</div>
            <h3 className="empty-state-title">Ready to explore?</h3>
            <p className="empty-state-text">
              Enter any topic above to generate a beautiful, interactive mind map powered by AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
