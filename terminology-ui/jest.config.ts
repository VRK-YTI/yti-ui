import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
    '^@common(.*)$': '<rootDir>/../common-ui$1',
    '^axios$': require.resolve('axios'),
  },
  moduleDirectories: [
    'node_modules',
    'src',
    '<rootDir>/../common-ui/node_modules',
    '<rootDir>/../common-ui',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testResultsProcessor: 'jest-junit',
  coverageReporters: ['html'],
};

export default config;
