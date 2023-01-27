import { Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Post('birthdays')
  async sendBirthDayMessages() {
    return this.messageService.getMembersBirthdayToday();
  }
}
