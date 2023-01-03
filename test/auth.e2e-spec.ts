import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { faker } from '@faker-js/faker';
import { Tokens } from '../src/auth/types';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  let token: Tokens;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    httpServer = app.getHttpServer();
  });

  const authDto: AuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const loginUser = async (
    authDto: AuthDto,
  ): Promise<Tokens> => {
    const { body } = await request(httpServer)
      .post('/auth/signin')
      .send(authDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return body;
  };

  describe('POST /auth/signup', () => {
    it('it should throw error if email is empty', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send({
          password: authDto.password,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if email is not valid', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send({
          email: 'we121312.com',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if password is empty', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send({
          email: authDto.email,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if no body is provided', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send()
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should sign up a new User', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send(authDto)
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body.access_token).toBeTruthy();
          expect(res.body.refresh_token).toBeTruthy();
        });
    });

    it('it should throw an error if email already exist', async () => {
      await request(httpServer)
        .post('/auth/signup')
        .send(authDto)
        .then((res) => {
          expect(res.status).toBe(403);
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('it should throw error if email is empty', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({
          password: authDto.password,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if email is not valid', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({
          email: 'we121312.com',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if password is empty', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({
          email: authDto.email,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if no body is provided', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send()
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('it should throw error if user email is not found', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({
          email: 'test@user.com',
          password: authDto.password,
        })
        .then((res) => {
          expect(res.status).toBe(403);
        });
    });

    it('it should throw error for invalid login credentials', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send({
          email: 'test@user.com',
          password: 'password',
        })
        .then((res) => {
          expect(res.status).toBe(403);
        });
    });

    it('it should sign in User', async () => {
      await request(httpServer)
        .post('/auth/signin')
        .send(authDto)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.access_token).toBeTruthy();
          expect(res.body.refresh_token).toBeTruthy();

          token = res.body;
        });
    });
  });

  describe('POST /auth/refresh', () => {
    it('should throw 401 unauthorized with invalid token', async () => {
      await request(httpServer)
        .post('/auth/refresh')
        .auth('token', { type: 'bearer' })
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it('should refresh user token', async () => {
      // wait for 1 second
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      await request(httpServer)
        .post('/auth/refresh')
        .auth(token.refresh_token, { type: 'bearer' })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.access_token).toBeTruthy();
          expect(res.body.refresh_token).toBeTruthy();

          expect(res.body.refresh_token).not.toBe(
            token.access_token,
          );

          expect(res.body.refresh_token).not.toBe(
            token.refresh_token,
          );
        });
    });
  });

  describe('POST /auth/logout', () => {
    it('should throw 401 unauthorized without token', async () => {
      await request(httpServer)
        .post('/auth/logout')
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it('should throw 401 unauthorized with invalid token', async () => {
      await request(httpServer)
        .post('/auth/logout')
        .auth('token', { type: 'bearer' })
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it('should logout user', async () => {
      token = await loginUser(authDto);

      await request(httpServer)
        .post('/auth/logout')
        .auth(token.access_token, { type: 'bearer' })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });
});
