import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  // Use Jest's own file crawler. Avoids failures from a broken local watchman install.
  watchman: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/interfaces/**',
    '!src/features/notion/types.ts',
    // next-intl config: ESM-only, covered by e2e not unit tests.
    '!src/i18n/**',
    '!src/proxy.ts',
    // Notion client singletons: always mocked in tests.
    '!src/features/notion/services/notion.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 94,
      functions: 90,
      lines: 95,
    },
  },
  moduleNameMapper: {
    // Same key as next/jest's built-in SVG rule, so this replaces it.
    // The app loads SVGs as React components via @svgr, not as file URLs.
    '^.+\\.(svg)$': '<rootDir>/test/svg-mock.tsx',
    // next-intl is ESM-only and cannot load in Jest. next/jest's SWC rewrites
    // '@/' imports to relative paths, so match the path suffix, not '^@/'.
    '/i18n/navigation$': '<rootDir>/test/i18n-navigation-mock.tsx',
    '^next/image$': '<rootDir>/test/next-image-mock.tsx',
    '^@marsidev/react-turnstile$': '<rootDir>/test/turnstile-mock.tsx',
    // Must stay after the specific '@/...' mappers above: the first match wins.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
