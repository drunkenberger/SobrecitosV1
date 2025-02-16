import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Add security headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.wordpress.com https://*.wp.com https://*.tempolabs.ai; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tempolabs.ai https://storage.googleapis.com https://*.wordpress.com https://*.wp.com; " +
    "style-src 'self' 'unsafe-inline' https://*.wordpress.com https://*.wp.com; " +
    "img-src 'self' data: https: blob: https://*.wordpress.com https://*.wp.com; " +
    "font-src 'self' data: https://*.wordpress.com https://*.wp.com; " +
    "connect-src 'self' https://*.tempolabs.ai https://*.wordpress.com https://*.wp.com https://storage.googleapis.com https://public-api.wordpress.com " +
    "https://api.openai.com https://generativelanguage.googleapis.com http://localhost:11434 https://*.ollama.ai; " +
    "frame-src 'self' https://*.wordpress.com https://*.wp.com; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "media-src 'self' https://*.wordpress.com https://*.wp.com; " +
    "object-src 'none'"
  );
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  next();
});

// Proxy endpoint for OpenAI
app.post('/api/ai/openai', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request to OpenAI' });
  }
});

// Proxy endpoint for Google's Gemini
app.post('/api/ai/gemini', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const { model } = req.body;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request to Gemini' });
  }
});

// Proxy endpoint for Ollama
app.post('/api/ai/ollama', async (req, res) => {
  try {
    const baseUrl = req.headers['x-base-url'] || 'http://localhost:11434';
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Ollama proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request to Ollama' });
  }
});

// Add your routes here
app.get('/', (_, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; 