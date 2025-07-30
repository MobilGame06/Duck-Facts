const { loadData } = require('../../utils/dataLoader');
const fs = require('fs').promises;
const path = require('path');

describe('dataLoader', () => {
  describe('loadData', () => {
    const testDataDir = path.join(__dirname, '../fixtures');
    const validJsonFile = path.join(testDataDir, 'valid.json');
    const invalidJsonFile = path.join(testDataDir, 'invalid.json');
    const nonExistentFile = path.join(testDataDir, 'nonexistent.json');

    beforeAll(async () => {
      // Create test fixtures directory
      await fs.mkdir(testDataDir, { recursive: true });
      
      // Create valid JSON test file
      await fs.writeFile(validJsonFile, JSON.stringify(['fact1', 'fact2', 'fact3']));
      
      // Create invalid JSON test file
      await fs.writeFile(invalidJsonFile, '{"invalid": json}');
    });

    afterAll(async () => {
      // Clean up test files
      try {
        await fs.unlink(validJsonFile);
        await fs.unlink(invalidJsonFile);
        await fs.rmdir(testDataDir);
      } catch {
        // Ignore cleanup errors
      }
    });

    it('should load and parse valid JSON file', async () => {
      const data = await loadData(validJsonFile);
      expect(data).toEqual(['fact1', 'fact2', 'fact3']);
    });

    it('should throw error for invalid JSON file', async () => {
      await expect(loadData(invalidJsonFile)).rejects.toThrow();
    });

    it('should throw error for non-existent file', async () => {
      await expect(loadData(nonExistentFile)).rejects.toThrow();
    });

    it('should handle empty file', async () => {
      const emptyFile = path.join(testDataDir, 'empty.json');
      await fs.writeFile(emptyFile, '');
      
      await expect(loadData(emptyFile)).rejects.toThrow();
      
      await fs.unlink(emptyFile);
    });
  });
});