const { param, validationResult } = require('express-validator');

/**
 * Validation middleware for the facts ID parameter
 */
const validateFactId = [
  param('id').isInt().withMessage('Invalid ID format').toInt(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    next();
  },
];

module.exports = {
  validateFactId,
};
