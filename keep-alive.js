require('dotenv').config();
const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.VITE_API_URL || process.env.BACKEND_URL || 'http://localhost:8080';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

function pingBackend() {
  const url = `${BACKEND_URL}/health`;
  const protocol = url.startsWith('https') ? https : http;
  
  console.log(`[${new Date().toISOString()}] Pinging ${url}...`);
  
  protocol.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`[${new Date().toISOString()}] ✓ Backend is alive (${res.statusCode})`);
      } else {
        console.log(`[${new Date().toISOString()}] ⚠ Backend responded with status ${res.statusCode}`);
      }
    });
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] ✗ Error pinging backend:`, err.message);
  });
}

// Ping immediately on start
pingBackend();

// Then ping every 10 minutes
setInterval(pingBackend, PING_INTERVAL);

console.log(`Keep-alive service started. Pinging ${BACKEND_URL} every 10 minutes.`);
