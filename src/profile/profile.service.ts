import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResponseProfile } from './interfaces/response-profile.interface';
import { SelectProfile } from './interfaces/select-profile.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  private readonly selectedProfile: SelectProfile = {
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
    createdAt: false,
    updatedAt: false,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateProfileDto,
  ): Promise<ResponseProfile> {
    const data: Prisma.ProfileCreateInput = {
      title: dto.title,
      avatarUrl: dto.avatarUrl,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    // se o usuário passar o ID do usuário, ele será usado
    'userId' in dto && (data.user.connect.id = dto.userId);

    return this.prisma.profile.create({
      data,
      select: {
        ...this.selectedProfile,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<ResponseProfile[]> {
    return this.prisma.profile.findMany({
      select: this.selectedProfile,
    });
  }

  async findOne(id: string): Promise<Profile | ResponseProfile> {
    const data = await this.findByID(id, {
      ...this.selectedProfile,
      createdAt: true,
      updatedAt: true,
    });
    return data;
  }

  async update(
    id: string,
    dto: UpdateProfileDto,
    user: User,
  ): Promise<ResponseProfile> {
    const profileOwner = await this.getOwnerId(id);
    // Se o usuário não for admin, só pode atualizar o próprio perfil
    if (!user.isAdmin && user.id !== profileOwner)
      throw {
        name: 'UnauthorizedError',
        message: 'Você não tem permissão para atualizar este perfil.',
      };

    const superUserId = await this.getSuperUserId();

    if (superUserId !== user.id && profileOwner === superUserId)
      throw {
        name: 'ForbiddenError',
        message: 'Você não tem permissão para alterar este perfil',
      };

    const data = { ...dto };

    return this.prisma.profile.update({
      where: { id },
      data,
      select: this.selectedProfile,
    });
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
    select: SelectProfile = null,
  ): Promise<Profile | ResponseProfile> {
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

  async getOwnerId(id: string): Promise<string> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      select: { userId: true },
    });

    return profile.userId;
  }

  async getSuperUserId(): Promise<string> {
    const superUserEmail = process.env.OWNER_EMAIL;
    const superUserId = await this.prisma.user.findUnique({
      where: { email: superUserEmail },
      select: { id: true },
    });

    return superUserId.id;
  }
}
