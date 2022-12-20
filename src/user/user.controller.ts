import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator/getUser';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getUser(@GetUser() user: User): User {
    return user;
  }
}
