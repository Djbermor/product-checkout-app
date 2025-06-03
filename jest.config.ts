import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
};
