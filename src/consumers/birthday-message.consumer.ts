import { Process, Processor } from '@nestjs/bull';
import { BIRTHDAY_MESSAGE_QUEUE } from '../common/constants/constants';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor(BIRTHDAY_MESSAGE_QUEUE)
export class BirthdayMessageConsumer {
  private readonly logger = new Logger(
    BirthdayMessageConsumer.name,
  );

  @Process()
  async sendBirthMessage(job: Job) {
    //log a message if data (Members[]) from the job is empty
    const { members } = job.data;
    if (members.length === 0) {
      this.logger.log(
        `No Member with Birthday today for Job: ${job.id}`,
      );
    }

    // Else Do some action
    this.logger.log(
      `Sending BirthDay messages for Job: ${job.id}`,
    );

    //loop through users and send each person a message
    members.forEach(
      async (member) =>
        await new Promise<void>(() =>
          setTimeout(
            () => this.birthDayMessage(member.fullName),
            4000,
          ),
        ),
    );

    await new Promise<void>((resolve) =>
      setTimeout(() => resolve(), 4000),
    );

    this.logger.log(
      `Completed job: ${job.id} and it has been successfully removed`,
    );
  }

  private birthDayMessage(memberName: string) {
    const msg = `Happy BirthDay to you ${memberName.toUpperCase()}. 
    Wishing you all the best in this Life. Enjoy your Day.`;
    // Perform API CALL to external service here
    console.log(msg);
  }
}
