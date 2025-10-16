import express from 'express';
import fetch from 'node-fetch';

const app = express();
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

// Function to extract styling information
const extractStyles = (node) => {
    const styles = {};
    
    if (node.style) {
        // Extract layout properties
        if (node.style.width) styles.width = node.style.width;
        if (node.style.height) styles.height = node.style.height;
        if (node.style.padding) styles.padding = node.style.padding;
        if (node.style.margin) styles.margin = node.style.margin;
        
        // Extract typography
        if (node.style.fontFamily) styles.fontFamily = node.style.fontFamily;
        if (node.style.fontSize) styles.fontSize = node.style.fontSize;
        if (node.style.fontWeight) styles.fontWeight = node.style.fontWeight;
        
        // Extract colors
        if (node.style.backgroundColor) styles.backgroundColor = node.style.backgroundColor;
        if (node.style.color) styles.color = node.style.color;
    }
    
    return styles;
};

// Helper function to delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to fetch nodes from Figma
async function fetchFigmaNodes(fileKey, nodeIds) {
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`;
    console.log(`Fetching batch of ${nodeIds.length} nodes...`);
    
    const response = await fetch(url, {
        headers: {
            'X-Figma-Token': FIGMA_TOKEN
        }
    });

    if (!response.ok) {
        throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

app.get('/figma/node', async (req, res) => {
    try {
        const fileKey = '0eg3UmbqMcZtym1x8sGtZX';
        const trackingPageNodeId = '255-2652';

        console.log('Fetching tracking page component...');
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${trackingPageNodeId}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const trackingPage = data.nodes[trackingPageNodeId];

        // Process the component data for the AI pipeline
        const processedData = {
            component: {
                name: 'TrackingPage',
                type: trackingPage.type,
                styles: extractStyles(trackingPage),
                children: trackingPage.children?.map(child => ({
                    name: child.name,
                    type: child.type,
                    styles: extractStyles(child),
                    content: child.characters || null // For text nodes
                })) || []
            },
            metadata: {
                framework: 'angular',
                brandContext: true,
                existingComponents: ['HomePage'],
                targetComponent: 'TrackingPage'
            }
        };

        console.log('Successfully processed tracking page component');
        res.json(processedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.toString() });
    }
});

const port = 4000;
const host = '127.0.0.1';

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/figma/node`);
    console.log('Press Ctrl+C to stop the server');
});