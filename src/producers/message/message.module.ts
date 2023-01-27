import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { BullModule } from '@nestjs/bull';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { BIRTHDAY_MESSAGE_QUEUE } from '../../common/constants/constants';
import { BirthdayMessageConsumer } from '../../consumers/birthday-message.consumer';
import { MemberService } from '../../member/member.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: BIRTHDAY_MESSAGE_QUEUE,
    }),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    BirthdayMessageConsumer,
    MemberService,
  ],
})
export class MessageModule {}
