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
    const englishFacts = [
      { id: 12, fact: 'English fact 1' },
      { id: 3, fact: 'English fact 2' },
    ];
    const germanFacts = [
      { id: 3, fact: 'German fact 2' },
      { id: 12, fact: 'German fact 1' },
    ];
    let loader;
    let readFile;

    beforeEach(() => {
      jest.resetModules();
      loader = require('../../utils/dataLoader');
      readFile = jest.spyOn(fs, 'readFile').mockImplementation((filename) => {
        const facts =
          path.basename(filename) === 'de.json' ? germanFacts : englishFacts;
        return Promise.resolve(JSON.stringify(facts));
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('loads only English by default, using an absolute module-relative path', async () => {
      expect(readFile).not.toHaveBeenCalled();
      expect(await loader.loadFactsByLanguage()).toEqual(englishFacts);
      expect(readFile).toHaveBeenCalledTimes(1);
      expect(readFile).toHaveBeenCalledWith(
        path.resolve(__dirname, '../../data/facts/en.json'),
        'utf8'
      );
    });

    it('loads each language separately and reuses the cached records', async () => {
      const en = await loader.loadFactsByLanguage('en');
      const de = await loader.loadFactsByLanguage('de');
      expect(de).toEqual(germanFacts);
      expect(await loader.loadFactsByLanguage('en')).toBe(en);
      expect(await loader.loadFactsByLanguage('de')).toBe(de);
      expect(readFile).toHaveBeenCalledTimes(2);
      expect(readFile).toHaveBeenCalledWith(
        path.resolve(__dirname, '../../data/facts/de.json'),
        'utf8'
      );
    });

    it('shares the initial file read across concurrent list and ID requests', async () => {
      let finishRead;
      readFile.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishRead = resolve;
          })
      );
      const requests = [
        loader.loadFactsByLanguage('en'),
        loader.loadFactsByLanguage('en'),
        loader.loadFactById(12, 'en'),
      ];
      expect(readFile).toHaveBeenCalledTimes(1);
      finishRead(JSON.stringify(englishFacts));
      const [first, second, record] = await Promise.all(requests);
      expect(first).toBe(second);
      expect(record).toBe(first[0]);
    });

    it.each(['fr', '../../secret', '__proto__', '', null, ['de']])(
      'falls back safely to English for %j',
      async (lang) => {
        expect(loader.getFactLanguage(lang)).toBe('en');
        expect(await loader.loadFactsByLanguage(lang)).toEqual(englishFacts);
        expect(await loader.loadFactsByLanguage('en')).toEqual(englishFacts);
        expect(readFile).toHaveBeenCalledTimes(1);
      }
    );

    it('looks up explicit IDs independent of array order, including gaps', async () => {
      expect(await loader.loadFactById(3)).toEqual(englishFacts[1]);
      expect(await loader.loadFactById(12, 'de')).toEqual(germanFacts[1]);
      expect(await loader.loadFactById(0)).toBeUndefined();
      expect(await loader.loadFactById(-1)).toBeUndefined();
      expect(await loader.loadFactById(999)).toBeUndefined();
      expect(readFile).toHaveBeenCalledTimes(2);
    });

    it('prevents callers from changing cached lists or records', async () => {
      const facts = await loader.loadFactsByLanguage();
      expect(Object.isFrozen(facts)).toBe(true);
      expect(Object.isFrozen(facts[0])).toBe(true);
      expect(() => facts.push({ id: 99, fact: 'Changed' })).toThrow();
      expect(Reflect.set(facts[0], 'fact', 'Changed')).toBe(false);
      expect(await loader.loadFactById(12)).toEqual(englishFacts[0]);
    });

    it('retries failed reads without discarding another cached language', async () => {
      const de = await loader.loadFactsByLanguage('de');
      readFile.mockRejectedValueOnce(new Error('File not found'));
      await expect(loader.loadFactsByLanguage('en')).rejects.toThrow(
        'File not found'
      );
      expect(await loader.loadFactsByLanguage('en')).toEqual(englishFacts);
      expect(await loader.loadFactsByLanguage('de')).toBe(de);
      expect(readFile).toHaveBeenCalledTimes(3);
    });

    it('retries after malformed JSON instead of caching the rejection', async () => {
      readFile.mockResolvedValueOnce('{invalid');
      await expect(loader.loadFactsByLanguage()).rejects.toThrow();
      expect(await loader.loadFactsByLanguage()).toEqual(englishFacts);
      expect(readFile).toHaveBeenCalledTimes(2);
    });

    it.each([
      null,
      {},
      [],
      ['Unstructured fact'],
      [null],
      [{ id: -1, fact: 'Invalid' }],
      [{ id: 1.5, fact: 'Invalid' }],
      [{ id: Number.MAX_SAFE_INTEGER + 1, fact: 'Invalid' }],
      [{ id: '0', fact: 'Invalid' }],
      [{ id: 0, fact: '' }],
      [{ id: 0, fact: '   ' }],
      [{ id: 0, fact: 123 }],
      [
        { id: 0, fact: 'First' },
        { id: 0, fact: 'Duplicate ID' },
      ],
    ])(
      'rejects invalid records %j and allows a later retry',
      async (invalid) => {
        readFile.mockResolvedValueOnce(JSON.stringify(invalid));
        await expect(loader.loadFactsByLanguage()).rejects.toThrow(
          'Invalid facts data'
        );
        expect(await loader.loadFactsByLanguage()).toEqual(englishFacts);
        expect(readFile).toHaveBeenCalledTimes(2);
      }
    );
  });
});
