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
    // iron-session v8 depends on 'uncrypto', which uses conditional exports to
    // serve ESM for browsers and CJS for Node. When Jest runs with jsdom, it
    // resolves to the browser ESM build (crypto.web.mjs) which Jest cannot
    // parse. Force it to use the Node CJS build instead.
    '^uncrypto$': require.resolve('uncrypto'),
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
  // Allow Babel to transform ESM-only packages (iron-session v8 and deps)
  transformIgnorePatterns: [
    '/node_modules/(?!(iron-session|uncrypto|iron-webcrypto)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testResultsProcessor: 'jest-junit',
  coverageReporters: ['html'],
};

export default config;
