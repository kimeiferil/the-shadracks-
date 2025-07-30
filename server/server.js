require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require('cookie-parser');
const path = require('path');

// Database connection
require('./database');

const app = express();

// Security middleware
app.use(helmet());
app.use(cookieParser());

// CSRF Protection
const { generateToken, validateRequest } = doubleCsrf({
  getSecret: () => process.env.SECRET_KEY,
  cookieName: "_csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"]
});

app.use(generateToken);

// Routes
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
require('./routes')(app, validateRequest);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
