import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, EditMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getMembers(refreshToken: string) {
    console.log(refreshToken);
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
    const member = await this.prisma.member.create({
      data: {
        ...dto,
      },
    });
    return member;
  }

  async updateMemberById(
    memberId: string,
    dto: EditMemberDto,
  ) {
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
        ...dto,
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
