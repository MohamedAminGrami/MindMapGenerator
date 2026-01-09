import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import MindMap from './MindMap';
import './App.css';

// API URL from environment variable (defaults to localhost for development)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('en');
  const [mindmapData, setMindmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const mindmapRef = useRef(null);

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
    try {
      // Target ONLY the mindmap-wrapper div which contains:
      // - connections-svg (SVG curved lines)
      // - mindmap-bg (background decorations)
      // - mindmap-layout (central node + branches + leaves)
      const mindmapWrapper = mindmapRef.current.querySelector('.mindmap-wrapper');
      
      if (!mindmapWrapper) {
        throw new Error('Mind map element not found');
      }
      
      // Wait for any CSS animations to complete
      await new Promise(resolve => setTimeout(resolve, 150));
      
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
        // Filter function to include only the mindmap elements
        filter: (node) => {
          // Include all nodes within mindmap-wrapper
          return true;
        },
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
            <span className="badge-text">✨ AI-Powered Visualization</span>
          </div>
          <h1 className="title">Mind Map Generator</h1>
          <p className="subtitle">
            Transform any topic into beautiful, interactive mind maps with AI intelligence
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
              <MindMap data={mindmapData} />
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
