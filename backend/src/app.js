const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/voters', require('./routes/voters'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/events', require('./routes/events'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/volunteer', require('./routes/volunteerRequests'));
app.use('/api/admin', require('./routes/admin'));

// Fallback to frontend for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = app;

