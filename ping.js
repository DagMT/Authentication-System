require('dotenv').config();
const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.VITE_API_URL || process.env.BACKEND_URL || process.argv[2] || 'http://localhost:8080';

function pingBackend() {
  const url = `${BACKEND_URL}/health`;
  const protocol = url.startsWith('https') ? https : http;
  
  console.log(`Pinging ${url}...`);
  
  protocol.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2));
          console.log('✓ Backend is healthy');
        } catch (e) {
          console.log('✓ Backend responded successfully');
        }
      } else {
        console.log('⚠ Backend responded with non-200 status');
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('✗ Error:', err.message);
    process.exit(1);
  });
}

pingBackend();
