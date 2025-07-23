module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/src/__tests__/utils/**/*.test.ts',
    '**/src/__tests__/services/**/*.test.ts',
    '**/src/__tests__/middlewares/**/*.test.ts'
  ],
  // Não inclui setupFilesAfterEnv, globalSetup ou globalTeardown
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
