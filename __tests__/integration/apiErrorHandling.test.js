const request = require('supertest');
const app = require('../../app');
const { loadFactsByLanguage, loadFactById } = require('../../utils/dataLoader');

jest.mock('../../utils/dataLoader', () => ({
  ...jest.requireActual('../../utils/dataLoader'),
  loadFactsByLanguage: jest.fn(),
  loadFactById: jest.fn(),
}));

describe('API Error Handling', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/facts/random - Error scenarios', () => {
    it('should return 500 when loading the language fails', async () => {
      loadFactsByLanguage.mockRejectedValue(new Error('File not found'));

      const response = await request(app).get('/api/facts/random').expect(500);

      expect(response.body).toEqual({
        error: 'Failed to load facts',
      });
    });
  });

  describe('GET /api/facts/:id - Error scenarios', () => {
    it('should return 500 when loading the ID index fails', async () => {
      loadFactById.mockRejectedValue(new Error('File corrupted'));

      const response = await request(app).get('/api/facts/0').expect(500);

      expect(response.body).toEqual({
        error: 'Failed to load facts',
      });
    });
  });

  it("uses a random record's stored ID instead of its array index", async () => {
    loadFactsByLanguage.mockResolvedValue([{ id: 27, fact: 'A duck fact.' }]);
    const response = await request(app)
      .get('/api/facts/random?lang=de')
      .expect(200);
    expect(response.body).toEqual({ id: 27, fact: 'A duck fact.', lang: 'de' });
    expect(loadFactsByLanguage).toHaveBeenCalledWith('de');
  });

  it('uses the ID lookup for a specific fact', async () => {
    loadFactById.mockResolvedValue({ id: 27, fact: 'A duck fact.' });
    const response = await request(app)
      .get('/api/facts/27?lang=de')
      .expect(200);
    expect(response.body).toEqual({ id: 27, fact: 'A duck fact.', lang: 'de' });
    expect(loadFactById).toHaveBeenCalledWith(27, 'de');
  });

  it('renders the homepage fallback if loading facts fails', async () => {
    loadFactsByLanguage.mockRejectedValue(new Error('Unavailable'));
    const response = await request(app).get('/?lang=de').expect(200);
    expect(response.text).toContain('Männliche Enten werden Erpel genannt');
  });
});
