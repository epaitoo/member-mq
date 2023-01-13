import { Test } from '@nestjs/testing';
import { appConfig } from '../../src/config/app';

export async function getTestingModule() {
  return Test.createTestingModule(appConfig).compile();
}
