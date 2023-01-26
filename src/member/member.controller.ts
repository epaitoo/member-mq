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
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto, EditMemberDto } from './dto';

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  @Get()
  getAllMembers() {
    return this.memberService.getMembers();
  }

  @Get('birthdays')
  getMembersBirthDay() {
    return this.memberService.getAllBirthday();
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
