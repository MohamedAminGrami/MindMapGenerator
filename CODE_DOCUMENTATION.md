# Code Documentation

This document provides a detailed explanation of the Mind Map Generator codebase, covering architecture, components, and implementation details.

## Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [Multi-language Support](#multi-language-support)
3. [UI Components](#ui-components)
4. [Backend API](#backend-api)
5. [AI Integration](#ai-integration)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Accessibility](#accessibility)
9. [Browser Support](#browser-support)
10. [Future Enhancements](#future-enhancements)

## Frontend Architecture

### App Component
Main React component that orchestrates the application state, language management, and UI rendering.

#### State Management
- `subject`: String - The input topic for mind map generation
- `language`: String - Current selected language ('english', 'french', 'arabic')
- `mermaidCode`: String - The generated Mermaid diagram code
- `loading`: Boolean - Loading state for async operations
- `error`: String - Error message if any

#### Key Methods
- `generateMindMap()`: Handles form submission and API call with language preference
- `normalizeArabic()`: Normalizes Arabic text for proper rendering
- `useEffect` hooks for managing document direction and language attributes
- `renderMermaid()`: Renders the Mermaid diagram with RTL support
- `resetMermaid()`: Cleans up Mermaid diagram

#### Localization
- `uiText` object containing localized strings for all UI elements
- Dynamic text direction (RTL/LTR) based on language selection
- Automatic font family switching for optimal text rendering

### Styling System
- CSS Variables for theming and consistent styling
- Responsive design using Flexbox and CSS Grid
- Dark/light theme support with `prefers-color-scheme`
- Smooth animations and transitions for better UX
- RTL-specific styles for Arabic language support

## Multi-language Support

### Language Management
- **Supported Languages**: English (en), French (fr), Arabic (ar)
- **Text Direction**: Automatic RTL/LTR switching
- **Font Handling**:
  - English/French: System UI fonts with fallbacks
  - Arabic: 'Noto Naskh Arabic' with Traditional Arabic fallback
- **Text Normalization**:
  - Arabic text normalization for consistent rendering
  - Diacritics handling
  - Digit conversion (Western to Arabic-Indic)

### Implementation Details
- **Language Context**:
  - Stored in React state
  - Persisted in localStorage
  - Synchronized with document attributes
- **RTL Support**:
  - Dynamic `dir` attribute on HTML root
  - CSS logical properties for layout
  - Text alignment adjustments
- **Localization System**:
  - Centralized string management
  - Dynamic content interpolation
  - Pluralization support

## UI Components

### Input Section
- **Language Selector**:
  - Dropdown with language flags
  - Auto-saves preference
  - Triggers UI updates
- **Text Input**:
  - Smart placeholder text
  - Auto-focus on mount
  - Clear button
- **Generate Button**:
  - Loading state
  - Disabled state
  - Success/error feedback

### Mind Map Container
- **Responsive Canvas**:
  - Adapts to container size
  - Preserves aspect ratio
  - Smooth zoom/pan
- **Node Styling**:
  - Themed colors
  - Hover/focus states
  - Accessible focus indicators

## Backend API

### Endpoints

#### POST /generate-mindmap
Generates a mind map for the given subject in the specified language.

**Request Headers:**
```http
Content-Type: application/json
Accept-Language: en|fr|ar
```

**Request Body:**
```json
{
  "subject": "Your Topic Here",
  "language": "english"
}
```

**Response:**
```json
{
  "success": true,
  "mermaidCode": "mindmap\n  root((Topic))\n    ...",
  "language": "english"
}
```

### Error Handling
- **400 Bad Request**: Missing or invalid parameters
- **500 Internal Server Error**: AI generation failed
- **503 Service Unavailable**: API rate limit exceeded

## AI Integration

### AI Model
- **Model Type**: Transformer-based language model
- **Training Data**: Large corpus of text in multiple languages
- **Inference**: Generates mind map code based on input topic and language

### Implementation Details
- **API Call**: Sends request to AI model with topic and language
- **Response Handling**: Parses response and updates state
- **Error Handling**: Catches and displays errors

## Error Handling

### Error Scenarios
1. **Empty Input**
   - Checked before API call
   - Message: "Please enter a subject"
2. **Network Failure**
   - Caught by try-catch
   - Message: Error from fetch
3. **HTTP errors**
   - Checked with `!res.ok`
   - Message: "Failed to generate mind map"
4. **JSON parsing errors**
   - Caught by try-catch
   - Message: Error message or generic fallback

### User Feedback
Errors are displayed in a styled error box:
```javascript
{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Performance Optimization

### Frontend
- **Rendering**:
  - Mermaid diagram virtualization
  - Efficient diffing for updates
  - RequestAnimationFrame for smooth animations
- **Network**:
  - Request deduplication
  - Response caching with ETags
  - Progressive loading for large diagrams
- **Memory**:
  - Proper cleanup of Mermaid instances
  - Event listener management
  - Garbage collection optimization

### Backend
- **Caching Layer**:
  - In-memory cache for frequent requests
  - Content-based cache keys
  - TTL management
- **Validation**:
  - Early rejection of invalid requests
  - Rate limiting
  - Input sanitization
- **Resource Management**:
  - Connection pooling
  - Memory leak prevention
  - Proper error boundaries

## Accessibility

### Keyboard Navigation
- Full keyboard support
- Logical tab order
- ARIA attributes
- Screen reader announcements

### Color Contrast
- WCAG 2.1 AA compliance
- High contrast mode
- Reduced motion support
- Forced colors mode

### Internationalization
- Dynamic number formatting
- Date/time localization
- Pluralization rules
- BiDi text handling

## Browser Support

### Desktop
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Mobile
- iOS Safari
- Chrome for Android
- Samsung Internet

### Fallbacks
- Feature detection
- Graceful degradation
- Polyfills for modern features

## Future Enhancements

### Core Features
1. **User Accounts**
   - Saved mind maps
   - Sharing and collaboration
   - Version history

### AI Enhancements
2. **Advanced AI Features**
   - Topic suggestions
   - Automatic categorization
   - Content summarization
   - Multi-language translation

### Export & Integration
3. **Export Options**
   - High-resolution images
   - PDF/PNG/SVG export
   - Markdown/OPML support
   - API access
## Conclusion

The Mind Map Generator is built with clean, maintainable code that separates concerns between logic and presentation. The use of React hooks, CSS classes, and proper error handling creates a robust, user-friendly application.
