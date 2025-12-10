require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = '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';

app.post('/generate-mindmap', async (req, res) => {
    const { subject, language = 'english' } = req.body;

    try {
        // Call Groq API to get JSON
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that generates mind map JSON.'
                    },
                    {
                        role: 'user',
                        content: `Create a mind map JSON for the subject: "${subject}". 
                        The mind map should be in ${language} language. 
                        Only return valid JSON with "title" and "nodes".
                        If the language is Arabic, make sure to use proper Arabic text.`
                    }
                ],
                max_tokens: 500
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

        // Convert JSON to circular Mermaid mindmap syntax
        const convertToMermaid = (json) => {
            let mermaid = `mindmap\n  root((${json.title}))\n`;
            
            const traverse = (node, indent) => {
                const text = node.text || node.label || '';
                mermaid += `${'    '.repeat(indent)}${text}\n`;
                
                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => traverse(child, indent + 1));
                }
            };
            
            if (json.nodes && json.nodes.length > 0) {
                json.nodes.forEach(node => traverse(node, 1));
            }
            
            return mermaid;
        };

        const mermaidCode = convertToMermaid(aiJson);

        res.json({ mermaidCode });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
