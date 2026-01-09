import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import MindMap from './MindMap';
import './App.css';

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
      const res = await fetch('http://localhost:5000/generate-mindmap', {
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

  const downloadMindMap = async () => {
    if (!mindmapRef.current) return;
    
    setDownloading(true);
    try {
      // Get the actual mindmap wrapper inside the display container
      const displayElement = mindmapRef.current;
      const mindmapWrapper = displayElement.querySelector('.mindmap-wrapper');
      const element = mindmapWrapper || displayElement;
      
      // Store original styles
      const originalOverflow = displayElement.style.overflow;
      const originalWidth = displayElement.style.width;
      const originalMinWidth = element.style.minWidth;
      
      // Temporarily adjust container to show full content
      displayElement.style.overflow = 'visible';
      displayElement.style.width = 'auto';
      
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the actual full dimensions
      const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, 1200);
      const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, 600);
      
      // Generate high-quality PNG with full dimensions
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#E0F2FE',
        width: fullWidth,
        height: fullHeight,
        cacheBust: true,
        style: {
          overflow: 'visible',
          width: fullWidth + 'px',
          minWidth: fullWidth + 'px',
        }
      });
      
      // Restore original styles
      displayElement.style.overflow = originalOverflow;
      displayElement.style.width = originalWidth;
      element.style.minWidth = originalMinWidth;
      
      // Create download link
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
