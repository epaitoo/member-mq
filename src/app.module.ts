import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';

@Module({
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
})
export class AppModule {}
