import fetch from 'node-fetch';

async function testServer() {
    try {
        // First test basic connectivity
        console.log('\n1. Testing basic endpoint...');
        let response = await fetch('http://127.0.0.1:4000/test');
        let data = await response.json();
        console.log('Test response:', data);

        // Then get the raw Figma JSON
        console.log('\n2. Fetching raw Figma JSON...');
        response = await fetch('http://127.0.0.1:4000/raw-json');
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
        }
        
        data = await response.json();
        console.log('\nFigma Raw JSON:');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

console.log('Starting test...');
testServer();