module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).{js,ts}',
    '**/*.(test|spec).{js,ts}'
  ],
  testPathIgnorePatterns: [
    'src/__tests__/helpers.ts',
    'src/__tests__/setup.ts',
    'src/__tests__/globalSetup.ts',
    'src/__tests__/globalTeardown.ts',
    'src/__tests__/jest.d.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: false,
      tsconfig: {
        types: ['jest', 'node']
      }
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Thresholds específicos para componentes críticos
    './src/controllers/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/models/': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    './src/utils/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 30000,
  // Configuração de path mapping para resolver @shared
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
  },
  // Configurações para MongoDB Memory Server
  // globalSetup/globalTeardown removidos: agora o MongoMemoryServer é iniciado no setup.ts
  // Verbose para melhor debugging
  verbose: true,
  // Clear mocks entre testes
  clearMocks: true,
  restoreMocks: true,
  // Detectar handles abertos
  detectOpenHandles: true,
  forceExit: true,
};
