const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "images.unsplash.com", "blob:"],
      connectSrc: ["'self'"],
    }
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Serve uploads directory for file uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/voters', require('./routes/voters'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/events', require('./routes/events'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/volunteer', require('./routes/volunteerRequests'));
app.use('/api/voter-requests', require('./routes/voterRequests'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/gamification', require('./routes/gamification'));

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = app;
