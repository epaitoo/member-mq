import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { RefreshTokenGuard } from 'src/common/guard';
import {
  GetCurrentUserId,
  GetUser,
} from 'src/common/decorator/getUser';
import { Public } from 'src/common/decorator/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signIn(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: string,
  ): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: string,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(
      userId,
      refreshToken,
    );
  }
}
