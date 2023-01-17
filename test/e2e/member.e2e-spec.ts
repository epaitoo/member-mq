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
import {
  CreateMemberDto,
  EditMemberDto,
} from '../../src/member/dto';

describe('MemberController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let httpServer: any;
  let token: Tokens;
  let moduleFixture: TestingModule;
  let timeoutId: NodeJS.Timeout;
  let memberId: string;

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
        timeoutId = setTimeout(async () => {
          await request(httpServer)
            .get('/members')
            .auth(token.access_token, { type: 'bearer' })
            .then((res) => {
              expect(res.body).toStrictEqual([]);
              expect(res.status).toBe(200);
            });
        }, 2000);
      });
    });
  });

  describe('POST /members', () => {
    const dto: CreateMemberDto = {
      fullName: faker.name.fullName(),
      phoneNumber: '3242354252452',
    };
    it('should create a Member', async () => {
      await request(httpServer)
        .post('/members')
        .auth(token.access_token, { type: 'bearer' })
        .send(dto)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(201);
          memberId = res.body.id;
        });
    });
  });

  describe('Get All Members', () => {
    it('should get members', async () => {
      timeoutId = setTimeout(async () => {
        await request(httpServer)
          .get('/members')
          .auth(token.access_token, { type: 'bearer' })
          .then((res) => {
            expect(res.body).toHaveLength(1);
            expect(res.status).toBe(200);
          });
      }, 2000);
    });
  });

  describe('GET /members', () => {
    describe('Get Member by id', () => {
      it('should get Member by id', async () => {
        await request(httpServer)
          .get(`/members/${memberId}`)
          .auth(token.access_token, { type: 'bearer' })
          .then((res) => {
            expect(res.body.id).toBe(memberId);
            expect(res.status).toBe(200);
          });
      });
    });
  });

  describe('PATCH /members/id', () => {
    describe('Update Member by id', () => {
      it('should update an existing member', async () => {
        const editDto: EditMemberDto = {
          fullName: 'Edited Member',
          phoneNumber: '1234567890',
        };

        timeoutId = setTimeout(async () => {
          await request(httpServer)
            .patch(`/members/${memberId}`)
            .auth(token.access_token, { type: 'bearer' })
            .send(editDto)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((res) => {
              expect(res.body.fullName).toBe(
                editDto.fullName,
              );
              expect(res.body.phoneNumber).toBe(
                editDto.phoneNumber,
              );
              expect(res.status).toBe(200);
            });
        }, 2000);
      });
    });
  });

  describe('DELETE /member/id', () => {
    describe('Delete Member by id', () => {
      it('should delete member by Id', async () => {
        await request(httpServer)
          .delete(`/members/${memberId}`)
          .auth(token.access_token, { type: 'bearer' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .then((res) => {
            expect(res.status).toBe(204);
          });
      });
      it('should get members', async () => {
        timeoutId = setTimeout(async () => {
          await request(httpServer)
            .get('/members')
            .auth(token.access_token, { type: 'bearer' })
            .then((res) => {
              expect(res.body).toStrictEqual([]);
              expect(res.status).toBe(200);
            });
        }, 2000);
      });
    });
  });

  afterEach(() => {
    clearTimeout(timeoutId);
  });

  afterAll(async () => {
    app.close();
  });
});
