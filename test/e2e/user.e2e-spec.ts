import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Tokens } from '../../src/auth/types';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthDto } from '../../src/auth/dto';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { AuthService } from '../../src/auth/auth.service';
import { EditUserDto } from '../../src/user/dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let httpServer: any;
  let token: Tokens;

  const authDto: AuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

    //create User and get the access token
    authService = app.get<AuthService>(AuthService);
    token = await authService.signup(authDto);

    httpServer = app.getHttpServer();
  });

  describe('GET /users/me', () => {
    it('should get current user', async () => {
      await request(httpServer)
        .get('/users/me')
        .auth(token.access_token, { type: 'bearer' })
        .then((res) => {
          expect(res.body.email).toBe(authDto.email);
          expect(res.status).toBe(200);
        });
    });
  });

  describe('Edit User', () => {
    it('should update user', async () => {
      const editUserDto: EditUserDto = {
        fullName: faker.name.fullName(),
        phoneNumber: '234234234231',
      };

      await request(httpServer)
        .patch('/users')
        .auth(token.access_token, { type: 'bearer' })
        .send(editUserDto)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });

  afterAll(async () => {
    // await prisma.cleanDb();
    app.close();
  });
});
