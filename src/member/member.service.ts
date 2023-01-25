import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, EditMemberDto } from './dto';
import * as moment from 'moment';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getMembers() {
    return await this.prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMemberById(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!member) {
      throw new ForbiddenException(
        'Resource does not exist',
      );
    }
    return await this.prisma.member.findFirst({
      where: { id: memberId },
    });
  }

  async createMember(dto: CreateMemberDto) {
    const isoBirthday = moment(
      dto.birthday,
      'DD/MM/YYYY',
    ).toISOString();
    const member = await this.prisma.member.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        group: dto.group,
        birthday: isoBirthday,
      },
    });
    return member;
  }

  async updateMemberById(
    memberId: string,
    dto: EditMemberDto,
  ) {
    const isoBirthday = moment(
      dto.birthday,
      'DD/MM/YYYY',
    ).toISOString();
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!member) {
      throw new ForbiddenException(
        'Resource does not exist',
      );
    }
    return await this.prisma.member.update({
      where: {
        id: memberId,
      },
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        group: dto.group,
        birthday: isoBirthday,
      },
    });
  }

  async deleteBookmarkById(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!member) {
      throw new ForbiddenException(
        'Resource does not exist',
      );
    }
    await this.prisma.member.delete({
      where: {
        id: memberId,
      },
    });
  }
}
