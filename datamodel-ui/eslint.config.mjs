import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  testingLibraryPlugin.configs['flat/react'],
  jestPlugin.configs['flat/recommended'],
  jestDomPlugin.configs['flat/recommended'],
  prettierConfig,
  {
    rules: {
      semi: [2, 'always'],
      quotes: ['error', 'single'],
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'xxx'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
      '@typescript-eslint/no-var-requires': 2,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-wrapper-object-types': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      'react-hooks/immutability': 0,
      'react-hooks/set-state-in-effect': 0,
      'testing-library/render-result-naming-convention': 0,
      'jest/require-hook': 0,
      'jest/prefer-expect-assertions': 0,
      'jest/no-hooks': 0,
      'jest/max-expects': 0,
      'import/no-named-as-default': 0,
      'jest/no-disabled-tests': 0,
    },
  },
]);
