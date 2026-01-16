/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings.
 * Uses environment variables with sensible defaults.
 * 
 * @module config/api
 */

/**
 * Base URL for the backend API.
 * Uses REACT_APP_API_URL environment variable or defaults to localhost.
 */
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * API Endpoints
 * All available API endpoints for the application.
 */
export const ENDPOINTS = {
  GENERATE_MINDMAP: '/generate-mindmap',
  EXTRACT_MINDMAP: '/extract-mindmap',
};

/**
 * Build full URL for an endpoint
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

const config = {
  API_URL,
  ENDPOINTS,
  getApiUrl,
};

export default config;
