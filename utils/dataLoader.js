const { promises: fs } = require('fs');
const path = require('path');

const factsDirectory = path.join(__dirname, '../data/facts');
const supportedLanguages = new Set(['en', 'de']);
const factsCache = new Map();

const getFactLanguage = (lang) => (supportedLanguages.has(lang) ? lang : 'en');

/**
 * Load and parse JSON data from a file
 * @param {string} filename - Path to the JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
const loadData = async (filename) => {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Only log errors in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Error reading file ${filename}:`, error);
    }
    throw error;
  }
};

/**
 * Cache validated records and their ID index once per language and process.
 * Pending reads are shared; failed reads are evicted so requests can retry.
 */
const loadFactsData = (lang) => {
  const language = getFactLanguage(lang);

  if (!factsCache.has(language)) {
    const filename = path.join(factsDirectory, `${language}.json`);
    const pendingFacts = loadData(filename)
      .then((facts) => {
        if (!Array.isArray(facts) || facts.length === 0) {
          throw new Error(`Invalid facts data for language ${language}`);
        }

        const byId = new Map();
        for (const record of facts) {
          if (
            !record ||
            !Number.isSafeInteger(record.id) ||
            record.id < 0 ||
            byId.has(record.id) ||
            typeof record.fact !== 'string' ||
            !record.fact.trim()
          ) {
            throw new Error(`Invalid facts data for language ${language}`);
          }

          Object.freeze(record);
          byId.set(record.id, record);
        }

        return { facts: Object.freeze(facts), byId };
      })
      .catch((error) => {
        factsCache.delete(language);
        throw error;
      });

    factsCache.set(language, pendingFacts);
  }

  return factsCache.get(language);
};

/** @returns {Promise<ReadonlyArray<{id: number, fact: string}>>} */
const loadFactsByLanguage = async (lang = 'en') => {
  const data = await loadFactsData(lang);
  return data.facts;
};

/** Look up the explicit ID in constant time, regardless of file order. */
const loadFactById = async (id, lang = 'en') => {
  const data = await loadFactsData(lang);
  return data.byId.get(id);
};

module.exports = {
  loadData,
  loadFactsByLanguage,
  loadFactById,
  getFactLanguage,
};
