const request = require('supertest');
const app = require('../../app');
const { loadData } = require('../../utils/dataLoader');

// Mock the loadData function to test error handling
jest.mock('../../utils/dataLoader');

describe('API Error Handling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/facts/random - Error scenarios', () => {
    it('should return 500 when loadData fails', async () => {
      loadData.mockRejectedValue(new Error('File not found'));

      const response = await request(app)
        .get('/api/facts/random')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to load facts'
      });
    });
  });

  describe('GET /api/facts/:id - Error scenarios', () => {
    it('should return 500 when loadData fails', async () => {
      loadData.mockRejectedValue(new Error('File corrupted'));

      const response = await request(app)
        .get('/api/facts/0')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to load facts'
      });
    });
  });
});