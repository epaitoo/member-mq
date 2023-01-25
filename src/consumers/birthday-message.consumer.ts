import { Process, Processor } from '@nestjs/bull';
import { BIRTHDAY_MESSAGE_QUEUE } from '../common/constants/constants';
import { Job } from 'bull';

@Processor(BIRTHDAY_MESSAGE_QUEUE)
export class BirthdayMessageConsumer {
  @Process()
  async transcode(job: Job<unknown>) {
    // Do some action
    console.log(`Transcoding message: ${job.id}`);
    console.log(`Data: ${JSON.stringify(job.data)}`);
    await new Promise<void>((resolve) =>
      setTimeout(() => resolve(), 4000),
    );
    console.log(`Transcoding complete for job: ${job.id}`);
  }
}
