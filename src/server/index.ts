import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Add security headers
app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.wordpress.com https://*.wp.com https://*.tempolabs.ai; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tempolabs.ai https://storage.googleapis.com https://*.wordpress.com https://*.wp.com; " +
    "style-src 'self' 'unsafe-inline' https://*.wordpress.com https://*.wp.com; " +
    "img-src 'self' data: https: blob: https://*.wordpress.com https://*.wp.com; " +
    "font-src 'self' data: https://*.wordpress.com https://*.wp.com; " +
    "connect-src 'self' https://*.tempolabs.ai https://*.wordpress.com https://*.wp.com https://storage.googleapis.com https://public-api.wordpress.com; " +
    "frame-src 'self' https://*.wordpress.com https://*.wp.com; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "media-src 'self' https://*.wordpress.com https://*.wp.com; " +
    "object-src 'none'"
  );
  
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  next();
});

// Add your routes here
app.get('/', (_, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 