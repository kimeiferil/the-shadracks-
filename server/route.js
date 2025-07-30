const express = require('express');
const router = express.Router();
const FamilyMember = require('./models/FamilyMember');
const auth = require('./middleware/auth');

// Public routes
router.get('/api/members', async (req, res) => {
  try {
    const members = await FamilyMember.find();
    res.json({ 
      members,
      csrfToken: req.csrfToken() // Add CSRF token to response
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected admin routes
router.post('/api/members', auth, (req, res, next) => {
  // Validate CSRF token first
  validateRequest(req, res, next);
}, async (req, res) => {
  // Add new family member
});

module.exports = (app, validateRequest) => {
  app.use(router);
};
