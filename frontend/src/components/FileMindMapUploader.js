/**
 * FileMindMapUploader Component
 *
 * Allows user to upload a PDF, DOCX, or image file, extracts text, and sends to backend for mindmap generation.
 * Supports Arabic, English, and other languages with proper UTF-8 encoding.
 */
import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileImage, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi';
import './FileMindMapUploader.css';

import { createWorker } from 'tesseract.js';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use unpkg CDN which has better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// CMap URL for proper Arabic/RTL character mapping in PDFs
const CMAP_URL = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`;
const STANDARD_FONT_URL = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FileMindMapUploader = ({ onMindMapData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  // Reset state
  const resetFile = (e) => {
    if (e) e.stopPropagation();
    setFile(null);
    setError('');
    setSuccess(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Normalize and clean extracted text (handles Arabic and other RTL text)
  const normalizeText = (text) => {
    if (!text) return '';
    // Normalize Unicode (NFC form for Arabic)
    let normalized = text.normalize('NFC');
    // Remove excessive whitespace while preserving structure
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
  };

  // Check if text contains Arabic characters
  const containsArabic = (text) => {
    // Arabic Unicode range: 0x0600-0x06FF (Arabic), 0x0750-0x077F (Arabic Supplement)
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicRegex.test(text);
  };

  // Check if text is mostly placeholder/tofu characters (indicates failed extraction)
  const isMostlyPlaceholder = (text) => {
    if (!text || text.length === 0) return true;
    // Count replacement characters, boxes, and non-printable chars
    const placeholderRegex = /[\uFFFD\u25A1\u25A0\u2610\u2612\u25FB-\u25FE]/g;
    const placeholders = (text.match(placeholderRegex) || []).length;
    // If more than 30% are placeholders, consider it failed
    return placeholders / text.length > 0.3;
  };

  // Extract text from PDF with Arabic support
  // Falls back to OCR if text extraction returns empty (image-based PDFs)
  const extractPdfText = async (arrayBuffer) => {
    setLoadingStatus('Loading PDF document...');
    
    // Load PDF with full CMap support for Arabic
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // Enable CMap for proper Arabic character mapping
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      // Standard font data URL for better font rendering
      standardFontDataUrl: STANDARD_FONT_URL,
      // Use standard fonts as fallback
      useSystemFonts: true,
      // Disable font face to force text extraction
      disableFontFace: false,
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    let hasArabicContent = false;
    
    // First, try to extract text directly
    setLoadingStatus('Extracting text from PDF...');
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent({
        normalizeWhitespace: false, // Keep original spacing for Arabic
        disableCombineTextItems: false,
        includeMarkedContent: true,
      });
      
      // Extract text items with proper handling
      const pageTextItems = content.items
        .filter(item => item.str && item.str.trim().length > 0)
        .map(item => {
          // Check direction for RTL text
          const text = item.str;
          if (containsArabic(text)) hasArabicContent = true;
          return text;
        });
      
      const pageText = pageTextItems.join(' ');
      console.log(`Page ${i} extracted:`, pageText.substring(0, 100));
      fullText += pageText + '\n';
    }
    
    // Check if extraction was successful
    const cleanedText = normalizeText(fullText);
    console.log('Direct extraction result length:', cleanedText.length);
    console.log('Has Arabic content:', hasArabicContent);
    console.log('Sample text:', cleanedText.substring(0, 200));
    
    // If text extraction returned very little content or is mostly placeholders, use OCR
    if (cleanedText.length < 30 || isMostlyPlaceholder(cleanedText)) {
      console.log('PDF text extraction insufficient, falling back to OCR...');
      return await extractPdfWithOcr(pdf);
    }
    
    return cleanedText;
  };

  // Extract text from PDF using OCR (for image-based PDFs)
  const extractPdfWithOcr = async (pdf) => {
    let fullText = '';
    
    setLoadingStatus('Initializing OCR engine...');
    
    // Create Tesseract worker with Arabic + English language support
    // Using 'ara+eng' for better recognition of mixed content
    let worker;
    try {
      worker = await createWorker(['ara', 'eng'], 1, {
        logger: (m) => {
          console.log('Tesseract:', m.status, m.progress);
          if (m.status === 'recognizing text') {
            setLoadingStatus(`Recognizing text... ${Math.round((m.progress || 0) * 100)}%`);
          } else if (m.status === 'loading language traineddata') {
            setLoadingStatus('Loading language data...');
          } else if (m.status === 'initializing api') {
            setLoadingStatus('Initializing OCR...');
          }
        },
        errorHandler: (err) => console.error('Tesseract error:', err),
      });
    } catch (workerError) {
      console.error('Failed to create worker with ara+eng, trying ara only:', workerError);
      // Fallback to Arabic only if combined fails
      worker = await createWorker('ara', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setLoadingStatus(`Recognizing text... ${Math.round((m.progress || 0) * 100)}%`);
          }
        },
      });
    }
    
    try {
      // Set parameters for better Arabic recognition
      await worker.setParameters({
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        preserve_interword_spaces: '1',
      });
      
      for (let i = 1; i <= pdf.numPages; i++) {
        setLoadingStatus(`Processing page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        
        // Render page to canvas at higher resolution for better OCR
        const scale = 2.5; // Good balance between quality and speed
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Fill with white background for better OCR
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          background: 'white',
        }).promise;
        
        // Convert canvas to blob for better handling
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Run OCR on the page image
        setLoadingStatus(`Running OCR on page ${i}...`);
        const { data } = await worker.recognize(blob);
        
        const pageText = data.text || '';
        console.log(`OCR Page ${i}:`, pageText.substring(0, 150));
        console.log(`Confidence: ${data.confidence}%`);
        
        if (pageText.trim()) {
          fullText += pageText + '\n';
        }
        
        // Clean up
        canvas.remove();
      }
    } catch (ocrError) {
      console.error('OCR processing error:', ocrError);
      throw new Error('OCR processing failed: ' + ocrError.message);
    } finally {
      await worker.terminate();
    }
    
    const result = normalizeText(fullText);
    console.log('Final OCR result length:', result.length);
    console.log('Final OCR sample:', result.substring(0, 300));
    return result;
  };

  // Extract text from DOCX with Arabic support
  const extractDocxText = async (arrayBuffer) => {
    setLoadingStatus('Extracting text from DOCX...');
    
    try {
      // mammoth.js handles UTF-8 and Arabic text automatically
      const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer,
      });
      
      const text = result.value || '';
      console.log('DOCX extraction result length:', text.length);
      console.log('DOCX sample:', text.substring(0, 200));
      
      // Check for any extraction warnings
      if (result.messages && result.messages.length > 0) {
        console.log('DOCX extraction messages:', result.messages);
      }
      
      return normalizeText(text);
    } catch (docxError) {
      console.error('DOCX extraction error:', docxError);
      throw new Error('Failed to extract text from DOCX: ' + docxError.message);
    }
  };

  // Extract text from images using OCR with Arabic support
  const extractImageText = async (file) => {
    setLoadingStatus('Initializing image OCR...');
    
    // Create worker with Arabic + English for mixed content
    let worker;
    try {
      worker = await createWorker(['ara', 'eng'], 1, {
        logger: (m) => {
          console.log('Image OCR:', m.status, Math.round((m.progress || 0) * 100) + '%');
          if (m.status === 'recognizing text') {
            setLoadingStatus(`Recognizing text... ${Math.round((m.progress || 0) * 100)}%`);
          } else if (m.status === 'loading language traineddata') {
            setLoadingStatus('Loading language data...');
          }
        },
      });
    } catch (err) {
      console.log('Falling back to Arabic only:', err);
      worker = await createWorker('ara', 1);
    }
    
    try {
      // Configure for better Arabic recognition
      await worker.setParameters({
        tessedit_pageseg_mode: '1',
        preserve_interword_spaces: '1',
      });
      
      setLoadingStatus('Running OCR on image...');
      const { data } = await worker.recognize(file);
      
      console.log('Image OCR result:', data.text.substring(0, 200));
      console.log('Confidence:', data.confidence);
      
      return normalizeText(data.text);
    } finally {
      await worker.terminate();
    }
  };

  // Extract text from file
  const extractText = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      return extractPdfText(arrayBuffer);
    } else if (ext === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      return extractDocxText(arrayBuffer);
    } else if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes(ext)) {
      return extractImageText(file);
    } else {
      throw new Error('Unsupported file type');
    }
  };

  // Handle file upload and extraction
  const handleFile = async (uploadedFile) => {
    setError('');
    setSuccess(false);
    setLoading(true);
    setLoadingStatus('Reading file...');
    setFile(uploadedFile);
    try {
      const extractedText = await extractText(uploadedFile);
      
      console.log('=== EXTRACTED TEXT ===' );
      console.log(extractedText);
      console.log('=== END EXTRACTED TEXT ===');
      
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract readable text from the file. Please try a different file or format.');
      }
      
      setLoadingStatus('Generating mind map...');
      
      // Send to backend for mindmap extraction
      const res = await fetch(`${API_URL}/extract-mindmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText })
      });
      if (!res.ok) throw new Error('Failed to generate mindmap from file');
      const data = await res.json();
      setSuccess(true);
      onMindMapData(data.mindmapData);
    } catch (err) {
      console.error('File processing error:', err);
      setError(err.message || 'Error processing file');
      setFile(null);
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const getFileIcon = () => {
    if (!file) return <FaCloudUploadAlt />;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className="icon-pdf" />;
    if (ext === 'docx') return <FaFileWord className="icon-word" />;
    if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes(ext)) return <FaFileImage className="icon-image" />;
    return <FaCloudUploadAlt />;
  };

  return (
    <div className="file-mindmap-uploader">
      <div className="file-mindmap-header">
        <span className="file-mindmap-title">
          <HiDocumentText /> Or Generate from Document
        </span>
        <p className="file-mindmap-desc">Upload a file to automatically extract topics</p>
      </div>

      <div
        className={`file-drop-area ${dragActive ? 'drag-active' : ''} ${loading ? 'loading' : ''} ${success ? 'success' : ''} ${error ? 'has-error' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        tabIndex={0}
        aria-disabled={loading}
        onClick={loading ? null : handleClick}
        role="button"
      >
        <input
          id="mindmap-file-input"
          type="file"
          accept=".pdf,.docx,image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="file-upload-input"
          ref={inputRef}
          style={{ display: 'none' }}
        />

        <div className="file-drop-content">
          <div className="file-drop-icon-wrapper">
            {loading ? <BiLoaderAlt className="loading-spinner" /> : getFileIcon()}
          </div>
          
          <div className="file-drop-text-container">
            {loading ? (
              <span className="loading-text">{loadingStatus || 'Processing...'}</span>
            ) : file ? (
              <div className="file-info-active">
                <span className="file-name">{file.name}</span>
                <button className="clear-file-btn" onClick={resetFile} title="Remove file">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <span className="main-text">Drop your file here</span>
                <span className="sub-text">or click to browse</span>
              </>
            )}
          </div>
        </div>

        {success && (
          <div className="success-overlay">
            <FaCheckCircle /> <span>Success! Mind map generated</span>
          </div>
        )}
      </div>

      {error && (
        <div className="file-error-message">
          <FaExclamationCircle /> {error}
        </div>
      )}

      {/* Supported Formats */}
      <div className="supported-formats">
        <span className="format-badge pdf">
          <FaFilePdf /> PDF
        </span>
        <span className="format-badge word">
          <FaFileWord /> DOCX
        </span>
        <span className="format-badge image">
          <FaFileImage /> Images
        </span>
      </div>
    </div>
  );
};

export default FileMindMapUploader;
