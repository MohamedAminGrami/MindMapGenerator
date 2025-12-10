# Mind Map Generator

An AI-powered application that transforms any topic into beautiful, interactive mind maps. Built with React and Mermaid, powered by AI intelligence.

## Overview

Mind Map Generator is a full-stack web application that uses artificial intelligence to automatically generate structured mind maps from user-provided topics. It features a modern, responsive UI with real-time visualization of complex hierarchical relationships.

## ✨ Features

- **🌍 Multi-language Support**
  - Generate mind maps in English, French, or Arabic
  - Right-to-Left (RTL) support for Arabic language
  - Localized UI elements and placeholders
  - Automatic text direction detection

- **🎨 Modern & Responsive UI**
  - Clean, accessible design with dark/light mode support
  - Smooth animations and transitions
  - Fully responsive layout for all devices
  - Interactive elements with hover/focus states
  - Beautiful gradient accents and shadows

- **🤖 AI-Powered Generation**
  - Intelligent mind map generation using advanced AI
  - Context-aware content creation
  - Optimized prompts for each supported language
  - Fast and efficient processing

- **Visualization**
  - Interactive Mermaid.js diagrams
  - Zoom and pan functionality
  - Clean node layouts and connections
  - Responsive rendering for all screen sizes

- **Performance**
  - Optimized for fast loading
  - Efficient state management
  - Minimal dependencies
  - Graceful error handling

## Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Mermaid.js** - Interactive diagram rendering with RTL support
- **CSS3** - Modern styling with CSS Variables and Flexbox/Grid
- **Fetch API** - For making HTTP requests to the backend
- **React Icons** - Beautiful, customizable icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Fast, minimalist web framework
- **Groq API** - Advanced AI for content generation
- **CORS** - Secure cross-origin requests
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **npm** - Package management

## Project Structure

```
MindMapGenerator/
├── frontend/              # Frontend React application
│   ├── public/            # Static assets and HTML template
│   └── src/               # Source code
│       ├── assets/        # Images, fonts, etc.
│       ├── components/    # Reusable UI components
│       ├── styles/        # Global styles and themes
│       ├── App.js         # Root component
│       ├── index.js       # Application entry point
│       └── index.css      # Global styles
│
└── backend/               # Backend server
    ├── routes/           # API endpoints
    ├── middlewares/      # Custom middleware
    ├── config/           # Configuration files
    ├── server.js         # Server setup and configuration
    ├── package.json      # Dependencies and scripts
    └── .env              # Environment variables
```

## Multi-language Support

The application supports three languages:

1. **English (en)** - Default language with LTR layout
2. **French (fr)** - French localization with LTR layout
3. **Arabic (ar)** - Right-to-Left (RTL) language support with proper text rendering

The UI automatically adjusts text direction, font families, and layout based on the selected language.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or Yarn (v1.22+)
- Groq API key for AI-powered generation

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MindMapGenerator.git
   cd MindMapGenerator
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add your Groq API key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   > Server will run on `http://localhost:5000`

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   > Application will open in your default browser at `http://localhost:3000`

## Usage Guide

### Creating a Mind Map
1. **Enter a topic** in the input field
2. **Select your language** from the dropdown (English, French, or Arabic)
3. Click **"Generate Map"** to create your mind map
4. The AI will process your request and generate an interactive visualization

### Interface Features
- **Language Selector**: Switch between English, French, and Arabic interfaces
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Nodes**: Hover over nodes to see connections
- **Dark/Light Mode**: Automatically adapts to system preferences

### Tips for Best Results
- Be specific with your topic for more focused mind maps
- Use clear, concise language for better AI understanding
- Try different languages to see how the AI structures information differently
- For Arabic content, ensure your system has proper RTL text rendering support

## API Endpoints

### POST /generate-mindmap
Generates a mind map for the given subject.

**Request:**
```json
{
  "subject": "Your Topic Here"
}
```

**Response:**
```json
{
  "mermaidCode": "mindmap\n  root((Topic))\n    ..."
}
```

## Development

### Available Scripts

#### Frontend
- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

#### Backend
- `python app.py` - Run Flask server
- `python -m pytest` - Run tests

## Code Architecture

### Frontend Components

**App.js** - Main component handling:
- State management (subject, mermaidCode, loading, error)
- API communication with backend
- Mermaid diagram rendering and lifecycle management
- UI rendering with CSS classes

### Styling

All styles are defined in `index.css` using semantic class names:
- `.app-container` - Main application wrapper
- `.input-section` - Input form area
- `.mindmap-container` - Mind map display area
- `.empty-state` - Initial state when no diagram is generated

## Error Handling

The application handles various error scenarios:
- Empty input validation
- Network request failures
- Mermaid rendering errors
- User-friendly error messages displayed in the UI

## Performance Considerations

- Mermaid cache is reset before rendering new diagrams
- DOM cleanup prevents memory leaks
- Async rendering with small delay ensures DOM updates
- CSS animations are GPU-accelerated

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
