import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload, JwtPayloadWithRt } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    console.log(config.get<string>('refreshTokenSecret'));

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('refreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: JwtPayload,
  ): JwtPayloadWithRt {
    console.log('has called validate');
    const refreshToken =
      req.headers.authorization &&
      req.headers.authorization.split(' ')[1];
    if (!refreshToken)
      throw new ForbiddenException(
        'Refresh token malformed',
      );
    console.log('refreshToken: ', refreshToken);

    return {
      ...payload,
      refreshToken,
    };
  }

  // validate(
  //   req: Request,
  //   payload: JwtPayload,
  // ): JwtPayloadWithRt {
  //   const refreshToken = req.headers.authorization
  //     ?.replace('Bearer', '')
  //     .trim();
  //   if (!refreshToken)
  //     throw new ForbiddenException(
  //       'Refresh token malformed',
  //     );
  //   console.log('refreshToken: ', refreshToken);

  //   return {
  //     ...payload,
  //     refreshToken,
  //   };
  // }
}
