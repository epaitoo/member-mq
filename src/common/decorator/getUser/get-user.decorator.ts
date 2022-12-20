import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { JwtPayloadWithRt } from 'src/auth/types';

export const GetUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRt | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) {
      delete request.user.hashedRt;

      return request.user;
    }

    return request.user[data];
  },
);
