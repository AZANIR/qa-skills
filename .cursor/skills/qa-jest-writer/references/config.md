# Jest Configuration Guide

## jest.config.ts (TypeScript)

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testTimeout: 10000,
};

export default config;
```

## tsconfig Paths → moduleNameMapper

When using path aliases in tsconfig:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Map them in Jest:

```typescript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@utils/(.*)$': '<rootDir>/src/utils/$1',
},
```

## Coverage Setup

```typescript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/index.ts',
  '!src/**/__tests__/**',
],
coverageDirectory: 'coverage',
coverageReporters: ['text', 'lcov', 'html'],
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

## transform

| Preset | Use Case |
| ------ | -------- |
| `ts-jest` | TypeScript |
| `babel-jest` | Babel + TS/JS |
| `@swc/jest` | Fast TS/JS via SWC |

```typescript
transform: {
  '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  '^.+\\.(js|jsx)$': 'babel-jest',
},
```

## testMatch

```typescript
testMatch: [
  '**/__tests__/**/*.[jt]s?(x)',
  '**/?(*.)+(spec|test).[jt]s?(x)',
],
```

## setupFiles

Global setup (runs before each test file):

```typescript
setupFiles: ['<rootDir>/jest.setup.ts'],
```

```typescript
// jest.setup.ts
process.env.NODE_ENV = 'test';
jest.setTimeout(10000);
```

## testEnvironment

| Value | Use Case |
| ----- | -------- |
| `node` | Node.js (APIs, utils) |
| `jsdom` | DOM (React, Vue) |
| `jest-environment-jsdom` | Same as jsdom (Jest 28+) |

## Common Options

| Option | Description |
| ------ | ----------- |
| `clearMocks` | Clear mock calls between tests |
| `restoreMocks` | Restore original implementations |
| `testTimeout` | Default timeout (ms) |
| `verbose` | Individual test results |
| `roots` | Root directories for tests |
| `moduleFileExtensions` | Resolve order (e.g. `['ts','tsx','js','json']`) |
