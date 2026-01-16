/**
 * Download Utilities
 * 
 * Utility functions for downloading and capturing mind maps as images.
 * Includes functions for calculating dimensions and processing images.
 * 
 * @module utils/downloadUtils
 */

import { toPng } from 'html-to-image';

/**
 * Calculates the full bounding box of an element including all its children,
 * accounting for overflow content, absolute positioning, and transforms.
 * This ensures the entire mind map is captured without truncation.
 * 
 * @param {HTMLElement} element - The container element
 * @returns {Object} The full dimensions {width, height, offsetX, offsetY}
 */
export const calculateFullBoundingBox = (element) => {
  const elementRect = element.getBoundingClientRect();
  const elementLeft = elementRect.left;
  const elementTop = elementRect.top;
  
  let minX = 0;
  let minY = 0;
  let maxX = elementRect.width;
  let maxY = elementRect.height;
  
  // Get all descendant elements
  const allElements = element.querySelectorAll('*');
  
  allElements.forEach(child => {
    const childRect = child.getBoundingClientRect();
    
    // Calculate position relative to the container
    const relativeLeft = childRect.left - elementLeft;
    const relativeTop = childRect.top - elementTop;
    const relativeRight = relativeLeft + childRect.width;
    const relativeBottom = relativeTop + childRect.height;
    
    // Update bounds
    minX = Math.min(minX, relativeLeft);
    minY = Math.min(minY, relativeTop);
    maxX = Math.max(maxX, relativeRight);
    maxY = Math.max(maxY, relativeBottom);
  });
  
  // Calculate total dimensions with padding for safety
  const padding = 20; // Extra padding to ensure nothing is cut off
  const width = Math.ceil(maxX - minX + padding * 2);
  const height = Math.ceil(maxY - minY + padding * 2);
  
  return {
    width: Math.max(width, 800),
    height: Math.max(height, 500),
    offsetX: minX - padding,
    offsetY: minY - padding
  };
};

/**
 * Converts an external image URL to a base64 data URL.
 * This is needed because html-to-image cannot access cross-origin images.
 * 
 * @param {string} url - External image URL
 * @returns {Promise<string>} Base64 data URL or fallback
 */
export const convertImageToDataUrl = async (url) => {
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
export const preProcessImages = async (wrapper) => {
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
export const restoreImages = (originalSrcs) => {
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
 * 
 * @param {HTMLElement} mindmapRef - Reference to the mind map container
 * @param {Object} mindmapData - The mind map data
 * @param {string} subject - The subject/title of the mind map
 * @param {Function} setError - Function to set error messages
 * @param {Function} generateSafeFilename - Function to generate safe filenames
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const downloadMindMap = async (mindmapRef, mindmapData, subject, setError, generateSafeFilename) => {
  if (!mindmapRef.current) return false;
  
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
    
    // Calculate the full bounding box including all overflow content
    // This ensures branches and leaves extending beyond the wrapper are captured
    const dimensions = calculateFullBoundingBox(mindmapWrapper);
    
    // Get computed styles for background color
    const computedStyle = window.getComputedStyle(mindmapWrapper);
    const bgColor = computedStyle.backgroundColor || '#f8fafc';
    
    // Generate PNG using DOM serialization (not pixel capture)
    // html-to-image serializes styles inline and renders via SVG foreignObject
    const dataUrl = await toPng(mindmapWrapper, {
      quality: 1,
      pixelRatio: 2, // 2x resolution for crisp output
      backgroundColor: bgColor, // Use computed background for consistency
      width: dimensions.width,
      height: dimensions.height,
      cacheBust: true,
      skipAutoScale: false, // Allow auto-scaling for proper sizing
      // Provide a transparent placeholder for any remaining failed images
      imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      style: {
        // Ensure content isn't clipped during export
        overflow: 'visible',
        // Add padding to account for any offset content
        margin: '0',
        padding: `${Math.abs(dimensions.offsetY)}px ${Math.abs(dimensions.offsetX)}px`,
        boxSizing: 'border-box',
      },
      // Filter function to handle elements that might cause issues
      filter: (node) => {
        // Include all nodes except those that are explicitly hidden
        if (node.style && node.style.visibility === 'hidden') {
          return false;
        }
        return true;
      }
    });
    
    // Generate safe filename that handles Arabic and Unicode characters
    const filename = generateSafeFilename(mindmapData?.title || subject || 'export');
    
    // Trigger download
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (err) {
    console.error('Failed to download mindmap:', err);
    setError('Failed to download mind map. Please try again.');
    return false;
  } finally {
    // Restore original image sources
    if (originalSrcs.size > 0) {
      restoreImages(originalSrcs);
    }
  }
};

const downloadUtils = {
  calculateFullBoundingBox,
  convertImageToDataUrl,
  preProcessImages,
  restoreImages,
  downloadMindMap,
};

export default downloadUtils;
