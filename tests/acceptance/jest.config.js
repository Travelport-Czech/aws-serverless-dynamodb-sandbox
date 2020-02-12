module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/../../src/$1'
  },
  globalSetup: '<rootDir>/bootstrap.ts',
  globalTeardown: '<rootDir>/teardown.ts',
}
