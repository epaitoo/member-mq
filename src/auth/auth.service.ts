import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from './types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    this.authDtoValidation(dto);

    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const tokens = this.getTokens(user.id, user.email);
      await this.updateRtHash(
        user.id,
        (
          await tokens
        ).refresh_token,
      );
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Email Already Exists',
          );
        }
        throw error;
      }
    }
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    this.authDtoValidation(dto);

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }

    //compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    if (!pwMatches) {
      throw new ForbiddenException('Invalid Credentials');
    }
    const tokens = this.getTokens(user.id, user.email);
    await this.updateRtHash(
      user.id,
      (
        await tokens
      ).refresh_token,
    );
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt)
      throw new ForbiddenException('Access Denied');

    //compare refresh token hash
    const rtMatches = await argon.verify(
      user.hashedRt,
      refreshToken,
    );
    if (!rtMatches)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  //Get refresh Token & Access Token
  async getTokens(
    userId: string,
    email: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        secret: this.config.get<string>('jwtSecret'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(jwtPayload, {
        secret: this.config.get<string>(
          'refreshTokenSecret',
        ),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public authDtoValidation = (dto: AuthDto) => {
    if (!dto.email) {
      throw new HttpException(
        'Email is required',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!dto.password) {
      throw new HttpException(
        'password is required',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!dto.email && !dto.password) {
      throw new HttpException(
        'Email and password is required',
        HttpStatus.BAD_REQUEST,
      );
    }
  };
}
