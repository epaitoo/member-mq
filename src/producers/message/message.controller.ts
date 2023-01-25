import { Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { Public } from '../../common/decorator/auth';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Public()
  @Post('birthdays')
  async transcode() {
    return this.messageService.transcode();
  }
}
