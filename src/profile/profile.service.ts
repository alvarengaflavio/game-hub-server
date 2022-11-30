import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResponseProfileDto } from './dto/response-profile.dto';
import { SelectProfileDto } from './dto/select-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  private readonly selectedProfile: SelectProfileDto = {
    id: true,
    title: true,
    avatarUrl: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProfileDto) {
    const data: Prisma.ProfileCreateInput = {
      title: dto.title,
      avatarUrl: dto.avatarUrl,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.prisma.profile.create({ data });
  }

  async findAll(): Promise<ResponseProfileDto[]> {
    return this.prisma.profile.findMany({
      select: this.selectedProfile,
    });
  }

  async findOne(id: string): Promise<Profile | ResponseProfileDto> {
    const data = await this.findByID(id, this.selectedProfile);
    return data;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(id: string): Promise<void> {
    await this.findByID(id);
    await this.prisma.profile.delete({ where: { id } });
  }

  // ------------------------------------------------------------------------------------------------
  //                                   Métodos adicionais
  // ------------------------------------------------------------------------------------------------

  async findByID(
    id: string,
    select: SelectProfileDto = null,
  ): Promise<Profile | ResponseProfileDto> {
    const profile = select
      ? await this.prisma.profile.findUnique({
          where: { id },
          select: select,
        })
      : await this.prisma.profile.findUnique({
          where: { id },
        });

    if (!profile)
      throw {
        name: 'NotFoundError',
        message: `Perfil com ID '${id}' não encontrado`,
      };

    return profile;
  }
}

// ------------------------------------------------------------------------------------------------
//                                   Tipos adicionais
// ------------------------------------------------------------------------------------------------
