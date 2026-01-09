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
        
        // Try to parse JSON, with error handling
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
