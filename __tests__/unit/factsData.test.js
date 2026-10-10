const facts = {
  en: require('../../data/facts/en.json'),
  de: require('../../data/facts/de.json'),
};

const normalize = (record) =>
  record.fact.normalize('NFKC').trim().toLowerCase();

describe('facts data integrity', () => {
  it('contains matching English and German fact counts', () => {
    expect(Array.isArray(facts.en)).toBe(true);
    expect(Array.isArray(facts.de)).toBe(true);
    expect(facts.en.length).toBe(facts.de.length);
  });

  it('contains at least 500 bilingual facts per language', () => {
    expect(facts.en.length).toBeGreaterThanOrEqual(500);
    expect(facts.de.length).toBeGreaterThanOrEqual(500);
  });

  it.each(['en', 'de'])(
    'contains valid records with unique explicit IDs in %s',
    (lang) => {
      const records = facts[lang];
      for (const record of records) {
        expect(Object.keys(record).sort()).toEqual(['fact', 'id']);
        expect(Number.isSafeInteger(record.id)).toBe(true);
        expect(record.id).toBeGreaterThanOrEqual(0);
        expect(typeof record.fact).toBe('string');
        expect(record.fact.trim().length).toBeGreaterThan(0);
      }
      expect(new Set(records.map((record) => record.id)).size).toBe(
        records.length
      );
    }
  );

  it('pairs German and English translations by the same ID', () => {
    expect(facts.en.map((record) => record.id).sort((a, b) => a - b)).toEqual(
      facts.de.map((record) => record.id).sort((a, b) => a - b)
    );
    const ids = new Set(facts.en.map((record) => record.id));
    for (let id = 0; id <= 499; id++) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('has no duplicate facts within each language list', () => {
    const uniqueEn = new Set(facts.en.map(normalize));
    const uniqueDe = new Set(facts.de.map(normalize));

    expect(uniqueEn.size).toBe(facts.en.length);
    expect(uniqueDe.size).toBe(facts.de.length);
  });
});
