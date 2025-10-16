import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Test endpoint
app.get('/test', (_, res) => {
    res.json({ status: 'ok', message: 'Server is working!' });
});

// Figma endpoint
app.get('/figma-test', async (_, res) => {
    try {
        const fileKey = '0eg3UmbqMcZtym1x8sGtZX';
        const nodeId = '255:2652';
        const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
        
        console.log('Requesting Figma API:', url);
        
        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
            }
        });
        
        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = 3846;
app.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${port}`);
});