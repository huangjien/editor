// Note: TypeScript 5.8.3+ may show compatibility warnings with @typescript-eslint/typescript-estree
// This is a known issue with React Native's ESLint config and doesn't affect functionality
module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: [
    '*.config.js',
    '.eslintrc.js',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'jest.setup.js',
    'tailwind.config.js',
    'e2e/jest.config.js',
    'e2e/**/*.test.js',
    'index.js',
    '__tests__/**/*.test.js',
    'coverage/**/*',
  ],
};
