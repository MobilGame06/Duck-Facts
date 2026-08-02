const facts = require('../../data/facts.json');

const normalize = (fact) => fact.trim().toLowerCase();

describe('facts data integrity', () => {
  it('contains matching English and German fact counts', () => {
    expect(Array.isArray(facts.en)).toBe(true);
    expect(Array.isArray(facts.de)).toBe(true);
    expect(facts.en.length).toBe(facts.de.length);
  });

  it('contains at least 271 bilingual facts per language', () => {
    expect(facts.en.length).toBeGreaterThanOrEqual(271);
    expect(facts.de.length).toBeGreaterThanOrEqual(271);
  });

  it('has no duplicate facts within each language list', () => {
    const uniqueEn = new Set(facts.en.map(normalize));
    const uniqueDe = new Set(facts.de.map(normalize));

    expect(uniqueEn.size).toBe(facts.en.length);
    expect(uniqueDe.size).toBe(facts.de.length);
  });
});
