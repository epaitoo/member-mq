import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './env';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { APP_GUARD } from '@nestjs/core';
import {
  JwtGuard,
  RefreshTokenGuard,
} from '../common/guard';

export const appConfig = {
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AuthModule,
    UserModule,
    MemberModule,
    PrismaModule,
  ],
  providers: [
    // All routes are protected, using public decorator (isPublic()) makes it public
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RefreshTokenGuard,
    // },
  ],
};
