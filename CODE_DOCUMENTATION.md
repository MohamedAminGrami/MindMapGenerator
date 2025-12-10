# Code Documentation

This document provides a detailed explanation of the Mind Map Generator codebase, covering architecture, components, and implementation details.

## Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [App.js Component](#appjs-component)
3. [Styling System](#styling-system)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Mermaid Rendering](#mermaid-rendering)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)

---

## Frontend Architecture

### Overview

The frontend is a single-page React application that provides an intuitive interface for generating AI-powered mind maps. The architecture follows a component-based approach with clear separation of concerns between logic and presentation.

### Key Technologies

- **React 18+**: Modern UI framework with hooks
- **Mermaid.js**: Diagram rendering engine
- **CSS3**: Styling with animations and gradients
- **Fetch API**: HTTP client for backend communication

### Directory Structure

```
frontend/src/
├── App.js              # Main component (354 lines)
├── index.js            # React entry point
├── index.css           # Global styles (270 lines)
└── App.test.js         # Component tests
```

---

## App.js Component

### Component Overview

The `App` component is the root component that manages the entire application state and user interactions.

### Imports

```javascript
import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
```

- **useState**: For managing component state (subject, mermaidCode, loading, error)
- **useEffect**: For side effects (Mermaid rendering)
- **useRef**: For DOM references (not currently used but available)
- **mermaid**: Library for rendering diagrams

### State Variables

```javascript
const [subject, setSubject] = useState('');           // User input topic
const [mermaidCode, setMermaidCode] = useState('');   // Generated diagram code
const [loading, setLoading] = useState(false);        // Loading state
const [error, setError] = useState('');               // Error messages
```

#### State Descriptions

- **subject**: Stores the user's input topic string. Updated in real-time as user types.
- **mermaidCode**: Stores the Mermaid diagram syntax returned from the backend.
- **loading**: Boolean flag indicating whether an API request is in progress.
- **error**: Stores error messages to display to the user.

### Core Functions

#### 1. generateMindMap()

```javascript
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
      body: JSON.stringify({ subject })
    });
    
    if (!res.ok) {
      throw new Error('Failed to generate mind map');
    }
    
    const data = await res.json();
    setMermaidCode(data.mermaidCode);
  } catch (err) {
    setError(err.message || 'Error generating mind map');
  } finally {
    setLoading(false);
  }
};
```

**Purpose**: Validates input, sends request to backend, and handles the response.

**Flow**:
1. Validates that subject is not empty
2. Sets loading state to true
3. Clears any previous errors
4. Sends POST request to backend with subject
5. Parses JSON response
6. Updates mermaidCode state with returned diagram
7. Catches and displays errors
8. Always sets loading to false in finally block

**Error Scenarios**:
- Empty subject input
- Network failures
- Invalid JSON response
- Backend errors (non-200 status)

#### 2. useEffect Hook - Mermaid Rendering

```javascript
useEffect(() => {
  if (mermaidCode) {
    const renderDiagram = async () => {
      try {
        // Clear previous SVG diagrams
        const svgElements = document.querySelectorAll('svg[id^="mermaid"]');
        svgElements.forEach(svg => svg.remove());
        
        // Reset mermaid cache
        if (mermaid.mermaidAPI) {
          mermaid.mermaidAPI.reset();
        }
        
        // Reinitialize mermaid
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'default',
          securityLevel: 'loose'
        });
        
        // Render new diagram
        const result = await mermaid.run();
      } catch (err) {
        console.error('Mermaid Render Error:', err);
      }
    };
    
    // Small delay to ensure DOM is updated
    setTimeout(renderDiagram, 100);
  }
}, [mermaidCode]);
```

**Purpose**: Renders Mermaid diagrams whenever mermaidCode changes.

**Key Steps**:
1. Checks if mermaidCode exists
2. Removes previous SVG elements to prevent duplicates
3. Resets Mermaid cache to clear state
4. Reinitializes Mermaid with configuration
5. Calls mermaid.run() to render the diagram
6. Uses setTimeout(100ms) to ensure DOM is ready

**Why the 100ms delay?**
React state updates are asynchronous. The delay ensures the DOM has been updated with the new mermaidCode before Mermaid tries to render it.

**Configuration Options**:
- `startOnLoad: false` - Don't auto-render on page load
- `theme: 'default'` - Use default Mermaid theme
- `securityLevel: 'loose'` - Allow complex diagrams

### JSX Structure

The component returns a single root div with the following structure:

```
<div className="app-container">
  ├── Background decorations (2 divs)
  └── <div className="content-wrapper">
      ├── Header section
      ├── Input section
      ├── Error message (conditional)
      ├── Mind map display (conditional)
      └── Empty state (conditional)
```

#### Conditional Rendering

**Error Message**:
```javascript
{error && (
  <div className="error-message">
    ⚠️ {error}
  </div>
)}
```
Shows only when `error` state is not empty.

**Mind Map Display**:
```javascript
{mermaidCode && (
  <div className="mindmap-container">
    <h2 className="mindmap-title">📊 Your Mind Map</h2>
    <div className="mindmap-display">
      <div key={mermaidCode} className="mermaid" style={{ width: '100%' }}>
        {mermaidCode}
      </div>
    </div>
  </div>
)}
```
Shows only when `mermaidCode` is not empty. The `key={mermaidCode}` forces React to remount the component when code changes.

**Empty State**:
```javascript
{!mermaidCode && !loading && (
  <div className="empty-state">
    <div className="empty-state-icon">🗺️</div>
    <h3 className="empty-state-title">Ready to explore?</h3>
    <p className="empty-state-text">
      Enter any topic above to generate a beautiful, interactive mind map powered by AI
    </p>
  </div>
)}
```
Shows when no diagram is generated and not loading.

---

## Styling System

### CSS Architecture

All styles are defined in `index.css` using a semantic class-based approach. This keeps the component clean and maintainable.

### CSS Classes Overview

#### Container Classes

**`.app-container`**
- Main application wrapper
- Full viewport height with gradient background
- Relative positioning for background decorations

**`.content-wrapper`**
- Constrains content to max-width of 1400px
- Centers content with auto margins
- Positioned relative with z-index for layering

#### Background Decorations

**`.bg-decoration-1` & `.bg-decoration-2`**
- Positioned absolutely for layering effect
- Use radial gradients for blur effect
- Pointer-events: none to prevent interaction

#### Header Section

**`.header`**
- Text-centered layout
- Large bottom margin for spacing

**`.badge`**
- Inline-block with gradient background
- Rounded pill shape (border-radius: 50px)
- Contains the "AI-Powered Visualization" text

**`.title`**
- Large heading (56px font)
- Gradient text effect using background-clip
- WebKit prefixes for cross-browser support

**`.subtitle`**
- Descriptive text below title
- Constrained width with centered margins

#### Input Section

**`.input-section`**
- Semi-transparent background with backdrop blur
- Border with low opacity for subtle effect
- Padding and shadow for depth

**`.input-container`**
- Flexbox layout with gap spacing
- Aligns input field and button horizontally

**`.input-field`**
- Full flex width
- Focus state changes border color and background
- Disabled state with reduced opacity
- Placeholder color styling

**`.generate-button`**
- Gradient background
- Hover effect with scale transform
- Disabled state with different styling
- Box shadow for depth

#### Display Sections

**`.mindmap-container`**
- Similar styling to input section
- Animation: fadeIn (0.5s ease-in)

**`.mindmap-display`**
- Flexbox centered layout
- Minimum height of 500px
- Dark background for contrast

**`.empty-state`**
- Dashed border for visual distinction
- Large padding for spacious feel
- Text-centered layout

### Animations

**`@keyframes fadeIn`**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Smooth fade-in with upward slide effect. Applied to mind map container.

### Color Palette

- **Primary Gradient**: #6366f1 to #a855f7 (Indigo to Purple)
- **Background**: #0f172a to #1e293b (Dark slate)
- **Text**: #e2e8f0 (Light slate)
- **Accent**: #cbd5e1 (Medium slate)
- **Error**: #fca5a5 (Light red)

### Responsive Design

The CSS uses:
- Relative units (em, rem) for scalability
- Flexbox for layout flexibility
- Max-width constraints for large screens
- Padding adjustments for mobile

---

## State Management

### State Flow Diagram

```
User Input
    ↓
setSubject() → subject state
    ↓
generateMindMap() triggered
    ↓
setLoading(true) → loading state
    ↓
Fetch API call
    ↓
setMermaidCode() → mermaidCode state
    ↓
useEffect triggered
    ↓
Mermaid renders diagram
    ↓
setLoading(false) → loading state
```

### State Transitions

| State | Initial | During Load | After Success | After Error |
|-------|---------|-------------|---------------|-------------|
| subject | '' | (unchanged) | (unchanged) | (unchanged) |
| mermaidCode | '' | (unchanged) | Diagram code | (unchanged) |
| loading | false | true | false | false |
| error | '' | '' | '' | Error message |

---

## API Integration

### Backend Communication

**Endpoint**: `POST http://localhost:5000/generate-mindmap`

**Request Format**:
```json
{
  "subject": "Quantum Physics"
}
```

**Response Format**:
```json
{
  "mermaidCode": "mindmap\n  root((Quantum Physics))\n    ..."
}
```

### Error Handling

The fetch call handles:
1. **Network errors**: Caught by try-catch
2. **HTTP errors**: Checked with `!res.ok`
3. **JSON parsing errors**: Caught by try-catch
4. **Timeout**: Not explicitly handled (consider adding)

### Request Headers

```javascript
headers: { 'Content-Type': 'application/json' }
```

Tells backend to expect JSON format.

---

## Mermaid Rendering

### Mermaid Initialization

```javascript
mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'default',
  securityLevel: 'loose'
});
```

**Configuration Explanation**:
- **startOnLoad**: false - Prevents auto-rendering on page load
- **theme**: 'default' - Uses Mermaid's default color scheme
- **securityLevel**: 'loose' - Allows more complex diagram features

### Rendering Process

1. **Clear Previous**: Remove old SVG elements
2. **Reset Cache**: Clear Mermaid's internal state
3. **Reinitialize**: Set up fresh Mermaid instance
4. **Render**: Call `mermaid.run()` to process diagram code
5. **Display**: Browser renders the SVG

### Why Reset?

Mermaid caches rendered diagrams. Without resetting:
- Old diagrams might interfere with new ones
- IDs could conflict
- Memory leaks could occur

### Diagram Structure

Expected Mermaid format:
```
mindmap
  root((Topic))
    Subtopic 1
      Detail 1
      Detail 2
    Subtopic 2
      Detail 3
```

---

## Error Handling

### Error Scenarios

1. **Empty Input**
   - Checked before API call
   - Message: "Please enter a subject"

2. **Network Failure**
   - Caught by try-catch
   - Message: Error from fetch

3. **Invalid Response**
   - Checked with `!res.ok`
   - Message: "Failed to generate mind map"

4. **JSON Parse Error**
   - Caught by try-catch
   - Message: Error message or generic fallback

5. **Mermaid Rendering Error**
   - Caught in useEffect try-catch
   - Logged to console (not shown to user)

### User Feedback

Errors are displayed in a styled error box:
```javascript
{error && (
  <div className="error-message">
    ⚠️ {error}
  </div>
)}
```

---

## Performance Optimization

### Rendering Optimization

1. **Conditional Rendering**: Components only render when needed
2. **Key Prop**: `key={mermaidCode}` forces remount on change
3. **Async Operations**: API calls don't block UI

### Memory Management

1. **DOM Cleanup**: Old SVG elements removed before new render
2. **Cache Reset**: Mermaid cache cleared to prevent leaks
3. **State Cleanup**: Error state cleared on new request

### Async Handling

```javascript
setTimeout(renderDiagram, 100);
```

Ensures DOM updates complete before Mermaid processes the diagram.

### Bundle Size

- React: ~42KB (gzipped)
- Mermaid: ~200KB (gzipped)
- CSS: ~5KB (gzipped)

---

## Development Workflow

### Adding a New Feature

1. **Update State**: Add new useState if needed
2. **Update Handler**: Modify generateMindMap or create new function
3. **Update JSX**: Add new elements with className
4. **Update CSS**: Add corresponding classes to index.css
5. **Test**: Verify functionality and styling

### Debugging Tips

1. **Console Logs**: Check browser console for Mermaid logs
2. **React DevTools**: Inspect component state
3. **Network Tab**: Verify API requests and responses
4. **CSS Inspection**: Use browser DevTools to check styles

### Common Issues

**Diagram not rendering**:
- Check browser console for Mermaid errors
- Verify mermaidCode is valid Mermaid syntax
- Ensure .mermaid div exists in DOM

**Styling issues**:
- Check CSS class names match JSX className
- Verify CSS file is imported in index.js
- Clear browser cache if styles don't update

**API errors**:
- Verify backend is running on port 5000
- Check CORS headers if cross-origin
- Verify request/response format matches

---

## Best Practices

1. **Separation of Concerns**: Logic in JS, styling in CSS
2. **Semantic HTML**: Meaningful class names and structure
3. **Error Handling**: Always catch and display errors
4. **Performance**: Optimize renders and API calls
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Testing**: Write unit tests for components and functions

---

## Future Improvements

1. Add TypeScript for type safety
2. Implement caching for generated diagrams
3. Add diagram export functionality (PNG, SVG, PDF)
4. Support for different diagram types
5. User authentication and saved diagrams
6. Real-time collaboration features
7. Custom styling options for diagrams
8. Keyboard shortcuts for power users

---

## Conclusion

The Mind Map Generator is built with clean, maintainable code that separates concerns between logic and presentation. The use of React hooks, CSS classes, and proper error handling creates a robust, user-friendly application.
