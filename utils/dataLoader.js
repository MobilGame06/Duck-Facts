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

module.exports = { loadData };