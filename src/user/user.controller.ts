import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorator/getUser';

@Controller('users')
export class UserController {
  @Get('me')
  getUser(@GetUser() user: User): User {
    return user;
  }
}
