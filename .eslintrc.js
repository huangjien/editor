// Note: TypeScript 5.8.3+ may show compatibility warnings with @typescript-eslint/typescript-estree
// This is a known issue with React Native's ESLint config and doesn't affect functionality
module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: [
    '*.config.js',
    '.eslintrc.js',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'tailwind.config.js',
    'e2e/jest.config.js',
    'e2e/**/*.test.js',
    'index.js',
    '__tests__/**/*.test.js',
  ],
};
