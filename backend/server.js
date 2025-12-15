const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow requests from Vercel and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or file:// protocol)
    if (!origin || origin === 'null') {
      return callback(null, true);
    }
    
    // Allow localhost for development (any port)
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow file:// protocol for local development
    if (origin.startsWith('file://')) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production, preview, and custom domains)
    if (origin.includes('.vercel.app') || 
        origin.includes('vercel.app') ||
        origin.includes('vercel.sh') ||
        origin.includes('vercel.com')) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    console.log('CORS: Rejected origin:', origin);
    
    // Default: deny (only in production)
    callback(null, true); // Temporarily allow all for debugging - change back if needed
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Stockage en mémoire
let messages = [];

// GET /api/messages - Retourne tous les messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// POST /api/messages - Ajoute un message
app.post('/api/messages', (req, res) => {
  const { author, content } = req.body;
  
  if (!author || !content) {
    return res.status(400).json({ error: 'Author and content are required' });
  }
  
  const message = {
    id: Date.now().toString(),
    author: author.trim(),
    content: content.trim(),
    timestamp: new Date().toISOString()
  };
  
  messages.push(message);
  res.status(201).json(message);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

