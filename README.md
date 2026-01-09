# Mind Map Generator

An AI-powered web application that transforms any topic into beautiful, interactive mind maps. Built with React and Node.js, powered by Groq AI.

## Overview

Mind Map Generator is a full-stack web application that uses artificial intelligence to automatically generate structured mind maps from user-provided topics. It features a modern, responsive UI with real-time visualization using SVG-based connections and Font Awesome icons.

## ✨ Features

### 🌍 Multi-language Support
- Generate mind maps in **English**, **French**, or **Arabic**
- Manual language selector for precise control
- Proper text rendering for all languages

### 🎨 Beautiful Visualization
- Color-coded branches with 6 distinct color themes
- Smooth curved SVG connection lines
- Font Awesome icons for visual context
- Gradient backgrounds with subtle decorations
- Central node with glowing effects

### 🤖 AI-Powered Generation
- Uses Groq API with `llama-3.3-70b-versatile` model
- Generates 3-5 main branches with 2-4 sub-topics each
- Intelligent icon selection from 80+ categories
- Context-aware content creation

### 📥 Export Functionality
- Download mind maps as high-quality PNG images
- Full resolution capture with proper styling
- Automatic filename based on topic

## Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **react-icons** - Font Awesome icon components
- **html-to-image** - PNG export functionality
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Axios** - HTTP client for Groq API
- **dotenv** - Environment variable management
- **cors** - Cross-origin request handling

## Project Structure

```
MindMapGenerator/
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   │   ├── index.html        # HTML template
│   │   ├── manifest.json     # PWA manifest
│   │   └── robots.txt        # SEO configuration
│   └── src/                  # Source code
│       ├── App.js            # Main component with input & download
│       ├── App.css           # Language selector styles
│       ├── MindMap.js        # Mind map visualization component
│       ├── MindMap.css       # Mind map styling
│       ├── iconMap.js        # Icon keyword to component mapping
│       ├── index.js          # React entry point
│       └── index.css         # Global styles
│
├── backend/                  # Node.js backend server
│   ├── server.js             # Express server & API endpoint
│   ├── promptBuilder.js      # AI prompt construction
│   ├── package.json          # Dependencies
│   └── .env                  # API key (create this file)
│
├── README.md                 # This file
└── CODE_DOCUMENTATION.md     # Detailed code documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later)
- Groq API key ([Get one free](https://console.groq.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/MindMapGenerator.git
   cd MindMapGenerator
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `backend` directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   > Server runs on `http://localhost:5000`

2. **Start the frontend (new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   > Opens in browser at `http://localhost:3000`

## Usage

1. **Enter a topic** in the input field (e.g., "Machine Learning", "Ancient Rome")
2. **Select output language** (English, Français, or العربية)
3. Click **"Generate Map"** or press Enter
4. Wait for AI to generate the mind map
5. Click **"📥 Download PNG"** to save the image

## API Endpoint

### POST /generate-mindmap

Generates a structured mind map for the given subject.

**Request:**
```json
{
  "subject": "Artificial Intelligence",
  "language": "en"
}
```

**Response:**
```json
{
  "mindmapData": {
    "title": "Artificial Intelligence",
    "nodes": [
      {
        "text": "Machine Learning",
        "icon": "brain",
        "children": [
          { "text": "Neural Networks", "icon": "network" },
          { "text": "Deep Learning", "icon": "data" }
        ]
      }
    ]
  }
}
```

## Icon Categories

The AI selects from 80+ icon keywords organized by category:

| Category | Icons |
|----------|-------|
| Education | education, book, study, school, graduation |
| Technology | science, technology, computer, code, data, server, cloud |
| Business | business, money, chart, growth, finance |
| Health | health, medical, heart, fitness, running |
| Nature | nature, plant, earth, water |
| Creative | art, music, design, idea, camera |
| Travel | travel, plane, car, map, rocket |
| General | star, check, warning, info, settings |

## Development

### File Descriptions

| File | Purpose |
|------|---------|
| `App.js` | Main component: input, language selector, download |
| `MindMap.js` | SVG visualization with curved connections |
| `iconMap.js` | Maps 80+ keywords to Font Awesome icons |
| `promptBuilder.js` | Constructs AI prompts with language support |
| `server.js` | Express server with Groq API integration |

### Available Scripts

**Frontend:**
```bash
npm start    # Development server
npm build    # Production build
```

**Backend:**
```bash
npm start    # Start Express server
```

## Error Handling

- Empty input validation with user feedback
- Network request error messages
- AI response parsing with fallbacks
- Download failure notifications

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Groq](https://groq.com) - Fast AI inference
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [html-to-image](https://github.com/bubkoo/html-to-image) - PNG export
