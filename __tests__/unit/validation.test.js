const request = require('supertest');
const express = require('express');
const { validateFactId } = require('../../middleware/validation');

// Create a test app to test the validation middleware
const app = express();
app.use(express.json());

// Test route that uses the validation middleware
app.get('/test/:id', validateFactId, (req, res) => {
  res.json({ id: req.params.id, message: 'validation passed' });
});

describe('Validation Middleware', () => {
  describe('validateFactId', () => {
    it('should pass validation for valid positive integer', async () => {
      const response = await request(app).get('/test/5').expect(200);

      expect(response.body).toEqual({
        id: 5, // Should be converted to integer
        message: 'validation passed',
      });
    });

    it('should pass validation for zero', async () => {
      const response = await request(app).get('/test/0').expect(200);

      expect(response.body).toEqual({
        id: 0,
        message: 'validation passed',
      });
    });

    it('should pass validation for negative integer', async () => {
      const response = await request(app).get('/test/-1').expect(200);

      expect(response.body).toEqual({
        id: -1,
        message: 'validation passed',
      });
    });

    it('should reject non-numeric strings', async () => {
      const response = await request(app).get('/test/invalid').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });

    it('should reject decimal numbers', async () => {
      const response = await request(app).get('/test/1.5').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });

    it('should reject mixed alphanumeric strings', async () => {
      const response = await request(app).get('/test/123abc').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });

    it('should convert string integers to numbers', async () => {
      const response = await request(app).get('/test/42').expect(200);

      expect(response.body.id).toBe(42);
      expect(typeof response.body.id).toBe('number');
    });
  });
});
