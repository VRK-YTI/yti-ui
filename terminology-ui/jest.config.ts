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
    // iron-session v8 ESM workaround:
    // iron-session depends on 'uncrypto' which has conditional exports that
    // resolve to browser ESM builds in jsdom environment. Jest cannot parse
    // ESM syntax, so we force uncrypto to use the Node.js CJS version.
    // See: https://github.com/unjs/uncrypto/blob/main/package.json#L9-L28
    '^uncrypto$': '<rootDir>/../node_modules/uncrypto/dist/crypto.node.cjs',
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
  // iron-session v8 ESM workaround:
  // These packages are ESM-only and need to be transformed by Babel.
  // The default /node_modules/ pattern excludes all node_modules from
  // transformation, but these packages use ESM syntax that Jest cannot parse.
  transformIgnorePatterns: [
    '/node_modules/(?!(iron-session|uncrypto|iron-webcrypto)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testResultsProcessor: 'jest-junit',
  coverageReporters: ['html'],
};

export default config;
