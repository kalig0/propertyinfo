/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    // The big one for ESM dependencies like axios:
    transformIgnorePatterns: ['node_modules/(?!axios)'],
    moduleNameMapper: {
      // If you want to stub out CSS modules:
      '\\.(css|scss)$': 'identity-obj-proxy',
    },
  };
  