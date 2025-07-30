const { loadData, loadFactsByLanguage } = require('../../utils/dataLoader');
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
      await fs.writeFile(
        validJsonFile,
        JSON.stringify(['fact1', 'fact2', 'fact3'])
      );

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

  describe('loadFactsByLanguage', () => {
    const testDataDir = path.join(__dirname, '../fixtures');
    const multilingualFile = path.join(testDataDir, 'multilingual.json');

    beforeAll(async () => {
      // Create test fixtures directory
      await fs.mkdir(testDataDir, { recursive: true });

      // Create multilingual test file
      const multilingualData = {
        en: ['English fact 1', 'English fact 2'],
        de: ['German fact 1', 'German fact 2'],
      };
      await fs.writeFile(multilingualFile, JSON.stringify(multilingualData));
    });

    afterAll(async () => {
      // Clean up test files
      try {
        await fs.unlink(multilingualFile);
        await fs.rmdir(testDataDir);
      } catch {
        // Ignore cleanup errors
      }
    });

    it('should load English facts by default', async () => {
      const facts = await loadFactsByLanguage(multilingualFile);
      expect(facts).toEqual(['English fact 1', 'English fact 2']);
    });

    it('should load English facts when lang=en', async () => {
      const facts = await loadFactsByLanguage(multilingualFile, 'en');
      expect(facts).toEqual(['English fact 1', 'English fact 2']);
    });

    it('should load German facts when lang=de', async () => {
      const facts = await loadFactsByLanguage(multilingualFile, 'de');
      expect(facts).toEqual(['German fact 1', 'German fact 2']);
    });

    it('should fall back to English for unsupported language', async () => {
      const facts = await loadFactsByLanguage(multilingualFile, 'fr');
      expect(facts).toEqual(['English fact 1', 'English fact 2']);
    });

    it('should throw error for invalid file', async () => {
      const invalidFile = path.join(testDataDir, 'invalid.json');
      await expect(loadFactsByLanguage(invalidFile)).rejects.toThrow();
    });
  });
});
