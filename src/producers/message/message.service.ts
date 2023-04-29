import { InjectQueue } from '@nestjs/bull';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  BIRTHDAY_MESSAGE_QUEUE,
  SMS_SENDER,
} from '../../common/constants/constants';
import { Queue } from 'bull';
import { MemberService } from '../../member/member.service';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue(BIRTHDAY_MESSAGE_QUEUE)
    private readonly memberBirthdayQueue: Queue,
    private readonly memberService: MemberService,
    private http: HttpService,
    private config: ConfigService,
  ) {}

  async getMembersBirthdayToday() {
    const members =
      await this.memberService.getAllBirthday();
    await this.memberBirthdayQueue.add(
      {
        members,
      },
      {
        removeOnComplete: true,
      },
    );
  }

  async sendBirthDayMessageSMS(
    message: string,
    recipient: string,
  ) {
    const apiUrl = this.config.get<string>('sms.baseUrl');
    const data = {
      sender: SMS_SENDER,
      message,
      recipients: [recipient],
    };

    const req = this.http
      .request({
        url: `${apiUrl}/v2/sms/send`, //change this to SMS Provider
        method: 'post',
        headers: {
          'api-key': this.config.get<string>('sms.apiKey'),
        },
        data,
      })
      .pipe(map((res) => res.status))
      .pipe(
        catchError(() => {
          throw new ForbiddenException(
            'API request failed',
          );
        }),
      );

    const statusCode = await lastValueFrom(req);
    return statusCode;
  }

  // Cron Job to create birthday message queues
  // @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async triggerMemberBirthdayQueue() {
    await this.getMembersBirthdayToday();
  }
}
