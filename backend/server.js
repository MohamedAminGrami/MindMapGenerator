require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = 'YOUR_API_KEY';

// Function to detect the primary language of text
function detectLanguage(text) {
    // Arabic characters range
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    // French-specific characters
    const frenchPattern = /[àâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ]/;
    
    const arabicCount = (text.match(new RegExp(arabicPattern, 'g')) || []).length;
    const frenchCount = (text.match(new RegExp(frenchPattern, 'g')) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    
    // If more than 20% Arabic characters, it's Arabic
    if (arabicCount / totalChars > 0.2) {
        return 'arabic';
    }
    
    // If contains French-specific characters, likely French
    if (frenchCount > 0) {
        return 'french';
    }
    
    // Default to English
    return 'english';
}

function getLanguageInstruction(language) {
    switch (language) {
        case 'arabic':
            return 'IMPORTANT: Respond ENTIRELY in Arabic (العربية). All text in the title, nodes, and children must be in Arabic only. Do not mix languages.';
        case 'french':
            return 'IMPORTANT: Respond ENTIRELY in French (Français). All text in the title, nodes, and children must be in French only. Do not mix languages.';
        default:
            return 'IMPORTANT: Respond ENTIRELY in English. All text in the title, nodes, and children must be in English only. Do not mix languages.';
    }
}

app.post('/generate-mindmap', async (req, res) => {
    const { subject } = req.body;
    
    // Detect the language of the input
    const detectedLanguage = detectLanguage(subject);
    const languageInstruction = getLanguageInstruction(detectedLanguage);

    try {
        // Call Groq API to get JSON
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant that generates structured mind map data in JSON format. 
Create comprehensive mind maps with 3-5 main branches, each with 2-4 sub-topics.
Every node must include a relevant emoji that represents the concept.
The structure should be educational and well-organized.
${languageInstruction}`
                    },
                    {
                        role: 'user',
                        content: `Create a detailed mind map JSON for the subject: "${subject}". 
${languageInstruction}
Return ONLY valid JSON with this exact structure:
{
  "title": "Main Topic",
  "nodes": [
    {
      "text": "Branch 1 Name",
      "emoji": "📚",
      "children": [
        { "text": "Sub-topic 1", "emoji": "📖" },
        { "text": "Sub-topic 2", "emoji": "✏️" }
      ]
    }
  ]
}
Make sure to include 3-5 main branches with meaningful sub-topics. Each node needs a relevant emoji.`
                    }
                ],
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let content = response.data.choices[0].message.content;
        
        // Remove markdown code blocks if present
        if (typeof content === 'string') {
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }
        
        // Try to parse JSON, with error handling
        let aiJson;
        try {
            aiJson = JSON.parse(content);
        } catch (parseError) {
            // Try to fix common JSON issues
            content = content
                .replace(/[\r\n]+/g, ' ')  // Remove newlines
                .replace(/,\s*}/g, '}')    // Remove trailing commas
                .replace(/,\s*]/g, ']')    // Remove trailing commas in arrays
                .replace(/:\s*'/g, ':"')   // Fix single quotes to double quotes
                .replace(/'\s*,/g, '",')   // Fix single quotes to double quotes
                .replace(/'\s*}/g, '"}');  // Fix single quotes to double quotes
            
            try {
                aiJson = JSON.parse(content);
            } catch (retryError) {
                console.error('Failed to parse JSON:', content.substring(0, 200));
                throw new Error('Invalid JSON response from AI');
            }
        }

        if (!aiJson || typeof aiJson !== 'object') {
            throw new Error('Invalid JSON response from AI');
        }

        if (!aiJson.title || typeof aiJson.title !== 'string') {
            aiJson.title = String(subject ?? '').trim() || 'Mind Map';
        }

        // Return the parsed JSON data for the frontend to render
        res.json({ mindmapData: aiJson });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
