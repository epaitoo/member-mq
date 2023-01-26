import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { BIRTHDAY_MESSAGE_QUEUE } from '../../common/constants/constants';
import { Queue } from 'bull';
import { MemberService } from '../../member/member.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue(BIRTHDAY_MESSAGE_QUEUE)
    private readonly memberBirthdayQueue: Queue,
    private readonly memberService: MemberService,
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
}
