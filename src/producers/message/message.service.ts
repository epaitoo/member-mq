import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { BIRTHDAY_MESSAGE_QUEUE } from '../../common/constants/constants';
import { Queue } from 'bull';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue(BIRTHDAY_MESSAGE_QUEUE)
    private readonly transcodeQueue: Queue,
  ) {}

  async transcode() {
    await this.transcodeQueue.add({
      fileName: './file.mp3',
    });
  }
}
