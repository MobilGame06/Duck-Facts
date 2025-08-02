import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
    },
    rules: {
      // Additional Node.js specific rules
      'no-console': 'off', // Allow console.log in Node.js apps
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: 'script',
    },
    rules: {
      'no-console': 'off', // Allow console.log in browser apps
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
  },
];
