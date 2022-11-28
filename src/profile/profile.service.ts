import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    const data: Prisma.ProfileCreateInput = {
      title: dto.title,
      avatarUrl: dto.avatarUrl,
      user: {
        connect: {
          id: dto.userId,
        },
      },
    };

    return this.prisma.profile.create({ data });
  }

  async findAll() {
    return this.prisma.profile.findMany({
      select: {
        id: true,
        title: true,
        avatarUrl: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} profile`;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }
}
