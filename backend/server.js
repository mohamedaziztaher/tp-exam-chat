const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow requests from Vercel and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production and preview)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Default: deny
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
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

