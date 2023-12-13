import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  moduleNameMapper: {
    '^@common(.*)$': '<rootDir>/src/common$1',
    '^@constants(.*)$': '<rootDir>/src/common/constants$1',
    '^@decorators(.*)$': '<rootDir>/src/common/decorators$1',
    '^@docs(.*)$': '<rootDir>/src/common/docs$1',
    '^@enums(.*)$': '<rootDir>/src/common/enums$1',
    '^@filters(.*)$': '<rootDir>/src/common/filters$1',
    '^@functions(.*)$': '<rootDir>/src/common/functions$1',
    '^@guards(.*)$': '<rootDir>/src/common/guards$1',
    '^@interceptors(.*)$': '<rootDir>/src/common/interceptors$1',
    '^@interfaces(.*)$': '<rootDir>/common/interfaces$1',
    '^@services(.*)$': '<rootDir>/src/common/services$1',
    '^@v1(.*)$': '<rootDir>/src/routes/v1$1',
    '^@app(.*)$': '<rootDir>/src/routes/app$1',
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  maxWorkers: 3,
};

export default config;
