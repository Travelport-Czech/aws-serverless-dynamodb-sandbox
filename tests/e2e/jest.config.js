module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/../../src/$1'
  },
  setupFiles: [
    '<rootDir>/bootstrap.ts'
  ]
}
