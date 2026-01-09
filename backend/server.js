/**
 * Mind Map Generator - Backend Server
 * 
 * Express server that handles mind map generation requests.
 * Uses Groq AI API to generate structured mind map data.
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { buildMindMapPrompt } = require('./promptBuilder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PORT = process.env.PORT || 5000;

/**
 * POST /generate-mindmap
 * Generates a mind map for the given subject in the specified language.
 * 
 * @body {string} subject - The topic to generate a mind map for
 * @body {string} language - Output language ('en', 'fr', 'ar')
 * @returns {object} mindmapData - Structured mind map JSON
 */
app.post('/generate-mindmap', async (req, res) => {
    const { subject, language } = req.body;

    try {
        // Build the prompt using the prompt builder with selected language
        const promptConfig = buildMindMapPrompt(subject, language || 'en');

        // Call Groq API to get JSON
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            promptConfig,
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
        
        // Parse JSON with error handling
        let aiJson;
        try {
            aiJson = JSON.parse(content);
        } catch (parseError) {
            // Try to fix common JSON issues
            content = content
                .replace(/[\r\n]+/g, ' ')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']')
                .replace(/:\s*'/g, ':"')
                .replace(/'\s*,/g, '",')
                .replace(/'\s*}/g, '"}');
            
            try {
                aiJson = JSON.parse(content);
            } catch (retryError) {
                console.error('Failed to parse JSON:', content.substring(0, 200));
                throw new Error('Invalid JSON response from AI');
            }
        }

        // Validate response structure
        if (!aiJson || typeof aiJson !== 'object') {
            throw new Error('Invalid JSON response from AI');
        }

        // Ensure title exists
        if (!aiJson.title || typeof aiJson.title !== 'string') {
            aiJson.title = String(subject ?? '').trim() || 'Mind Map';
        }

        res.json({ mindmapData: aiJson });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
