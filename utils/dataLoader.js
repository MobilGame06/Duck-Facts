const { promises: fs } = require('fs');

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
 * Load facts for a specific language from the multilingual facts file
 * @param {string} filename - Path to the JSON file
 * @param {string} lang - Language code (default: 'en')
 * @returns {Promise<Array>} Array of facts in the specified language
 */
const loadFactsByLanguage = async (filename, lang = 'en') => {
  try {
    const data = await loadData(filename);
    const facts = data[lang];
    if (!facts) {
      // Fall back to English if requested language not found
      return data['en'] || [];
    }
    return facts;
  } catch (error) {
    // Only log errors in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Error loading facts for language ${lang}:`, error);
    }
    throw error;
  }
};

module.exports = { loadData, loadFactsByLanguage };
