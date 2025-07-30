module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'routes/**/*.js',
    'utils/**/*.js',
    'app.js',
    '!**/node_modules/**',
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['__tests__/setup.js', '__tests__/fixtures/'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
};
