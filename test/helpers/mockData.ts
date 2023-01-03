import { faker } from '@faker-js/faker';

export function mockUser() {
  return {
    email: faker.internet.email(),
    hash: faker.internet.password(),
    fullName: faker.name.fullName(),
  };
}
