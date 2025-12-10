# Mind Map Generator

An AI-powered application that transforms any topic into beautiful, interactive mind maps. Built with React and Mermaid, powered by AI intelligence.

## Overview

Mind Map Generator is a full-stack web application that uses artificial intelligence to automatically generate structured mind maps from user-provided topics. It features a modern, responsive UI with real-time visualization of complex hierarchical relationships.

## Features

- **AI-Powered Generation**: Automatically generates mind map structures using AI
- **Interactive Visualization**: Beautiful, zoomable mind maps using Mermaid diagrams
- **Real-time Rendering**: Instant visual feedback as diagrams are generated
- **Modern UI**: Sleek dark-themed interface with gradient effects and smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful error messages and validation

## Project Structure

```
mindmap-generator/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── index.js         # React entry point
│   │   ├── index.css        # Global styles
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                  # Backend API server
│   ├── app.py               # Flask application
│   ├── requirements.txt      # Python dependencies
│   └── ...
└── README.md                # This file
```

## Tech Stack

### Frontend
- **React**: UI framework
- **Mermaid**: Diagram rendering library
- **CSS3**: Styling with gradients and animations

### Backend
- **Python/Flask**: REST API server
- **AI Integration**: LLM-based mind map generation

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python app.py
```

The API will be available at [http://localhost:5000](http://localhost:5000)

## Usage

1. Open the application in your browser
2. Enter any topic in the input field (e.g., "Quantum Physics", "Ancient Rome", "Machine Learning")
3. Click "Generate Map" or press Enter
4. Wait for the AI to generate the mind map structure
5. View the interactive diagram that appears below

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
