import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../common/guard';
import { MemberService } from './member.service';
import { CreateMemberDto, EditMemberDto } from './dto';
import { GetUser } from '../common/decorator/getUser';

@UseGuards(RefreshTokenGuard)
@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  getAllMembers(
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.memberService.getMembers(refreshToken);
  }

  @Get(':id')
  getMemberById(@Param('id') memberId: string) {
    return this.memberService.getMemberById(memberId);
  }

  @Post()
  createMember(@Body() dto: CreateMemberDto) {
    return this.memberService.createMember(dto);
  }

  @Patch(':id')
  editMemberById(
    @Param('id') memberId: string,
    @Body() dto: EditMemberDto,
  ) {
    return this.memberService.updateMemberById(
      memberId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMemberById(@Param('id') memberId: string) {
    return this.memberService.deleteBookmarkById(memberId);
  }
}
