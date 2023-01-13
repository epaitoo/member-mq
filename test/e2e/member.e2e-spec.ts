import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { Tokens } from '../../src/auth/types';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../helpers/app';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AuthDto } from '../../src/auth/dto';

describe('MemberController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let httpServer: any;
  let token: Tokens;
  let moduleFixture: TestingModule;

  const authDto: AuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    moduleFixture = await getTestingModule();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

    //create User and get the access token
    authService = app.get<AuthService>(AuthService);
    await authService.signup(authDto);
    token = await authService.signIn(authDto);

    httpServer = app.getHttpServer();
  });

  describe('GET /members', () => {
    describe('Get empty members', () => {
      it('should get members', async () => {
        await request(httpServer)
          .get('/members')
          .auth(token.refresh_token, { type: 'bearer' })
          .then((res) => {
            expect(res.body).toBe([]);
            expect(res.status).toBe(200);
          });
      });
    });
  });
  // describe('Post /members', () => {});
  // describe('Get Member by id', () => {});
  // describe('Update Member by id', () => {});
  // describe('Delete Member by id', () => {});

  afterAll(async () => {
    // await prisma.cleanDb();
    app.close();
  });
});
