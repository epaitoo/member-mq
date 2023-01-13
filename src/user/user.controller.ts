import {
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorator/getUser';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  getUser(@GetUser() user: User): User {
    return user;
  }

  @Patch()
  editUser(
    @GetUser() user: User,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(user.id, dto);
  }
}
