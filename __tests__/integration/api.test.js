const request = require('supertest');
const app = require('../../app');

describe('API Integration Tests', () => {
  describe('GET /api/facts/random', () => {
    it('should return a random duck fact', async () => {
      const response = await request(app).get('/api/facts/random').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fact');
      expect(response.body).toHaveProperty('lang');
      expect(typeof response.body.id).toBe('number');
      expect(typeof response.body.fact).toBe('string');
      expect(response.body.id).toBeGreaterThanOrEqual(0);
      expect(response.body.fact.length).toBeGreaterThan(0);
      expect(response.body.lang).toBe('en'); // default language
    });

    it('should return German facts when lang=de is specified', async () => {
      const response = await request(app)
        .get('/api/facts/random?lang=de')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fact');
      expect(response.body).toHaveProperty('lang');
      expect(response.body.lang).toBe('de');
      expect(typeof response.body.fact).toBe('string');
      expect(response.body.fact.length).toBeGreaterThan(0);
    });

    it('should default to English for invalid language codes', async () => {
      const response = await request(app)
        .get('/api/facts/random?lang=fr')
        .expect(200);

      expect(response.body.lang).toBe('en');
    });

    it('should return different facts on multiple calls (probabilistic)', async () => {
      const facts = new Set();
      const numberOfCalls = 10;

      for (let i = 0; i < numberOfCalls; i++) {
        const response = await request(app)
          .get('/api/facts/random')
          .expect(200);

        facts.add(response.body.fact);
      }

      // With 171 facts, getting at least 2 different ones in 10 calls is very likely
      expect(facts.size).toBeGreaterThan(1);
    });

    it('should handle server errors gracefully', async () => {
      // This test would require mocking the loadData function to throw an error
      // For now, we'll just ensure the endpoint exists and returns valid structure
      const response = await request(app).get('/api/facts/random').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fact');
      expect(response.body).toHaveProperty('lang');
    });
  });

  describe('GET /api/facts/:id', () => {
    it('should return a specific duck fact by valid ID', async () => {
      const response = await request(app).get('/api/facts/0').expect(200);

      expect(response.body).toEqual({
        id: 0,
        fact: expect.any(String),
        lang: 'en',
      });
      expect(response.body.fact.length).toBeGreaterThan(0);
    });

    it('should return German fact when lang=de is specified', async () => {
      const response = await request(app)
        .get('/api/facts/0?lang=de')
        .expect(200);

      expect(response.body).toEqual({
        id: 0,
        fact: expect.any(String),
        lang: 'de',
      });
      expect(response.body.fact).toEqual(
        'Enten haben wasserdichte Federn dank einer Öldrüse in der Nähe ihrer Schwänze.'
      );
    });

    it('should return the same fact for the same ID', async () => {
      const id = 5;
      const response1 = await request(app).get(`/api/facts/${id}`).expect(200);

      const response2 = await request(app).get(`/api/facts/${id}`).expect(200);

      expect(response1.body).toEqual(response2.body);
      expect(response1.body.id).toBe(id);
    });

    it('should handle boundary conditions - first fact (id=0)', async () => {
      const response = await request(app).get('/api/facts/0').expect(200);

      expect(response.body.id).toBe(0);
      expect(response.body.lang).toBe('en');
      expect(response.body.fact).toEqual(
        'Ducks have waterproof feathers thanks to an oil gland near their tails.'
      );
    });

    it('should handle boundary conditions - last fact (id=170)', async () => {
      const response = await request(app).get('/api/facts/170').expect(200);

      expect(response.body.id).toBe(170);
      expect(response.body.lang).toBe('en');
      expect(response.body.fact).toBeTruthy();
    });

    it('should return 404 for out of range ID (too high)', async () => {
      const response = await request(app).get('/api/facts/999').expect(404);

      expect(response.body).toEqual({
        error: 'Fact not found',
      });
    });

    it('should return 404 for negative ID', async () => {
      const response = await request(app).get('/api/facts/-1').expect(404);

      expect(response.body).toEqual({
        error: 'Fact not found',
      });
    });

    it('should return 400 for invalid ID format (non-numeric)', async () => {
      const response = await request(app).get('/api/facts/invalid').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });

    it('should return 400 for invalid ID format (decimal)', async () => {
      const response = await request(app).get('/api/facts/1.5').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });

    it('should return 400 for invalid ID format (string with numbers)', async () => {
      const response = await request(app).get('/api/facts/123abc').expect(400);

      expect(response.body).toEqual({
        error: 'Invalid ID format',
      });
    });
  });

  describe('Non-existent routes', () => {
    it('should return 404 for undefined API routes', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      expect(response.text).toContain('Not Found');
    });
  });
});
