import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SelectUser } from './interfaces/select-user.interface';
import { ResponseUser } from './interfaces/response-user.interface';

@Injectable()
export class UserService {
  private readonly allUsersSelect = {
    id: true,
    name: true,
    email: true,
    cpf: false,
    password: false,
    _count: {
      select: {
        profiles: true,
        games: true,
      },
    },
    isAdmin: false,
    createdAt: false,
    updatedAt: false,
  };

  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    cpf: true,
    password: false,
    profiles: {
      select: {
        id: true,
        title: true,
        avatarUrl: true,
        createdAt: false,
        updatedAt: false,
      },
    },
    games: {
      select: {
        gameId: true,
      },
    },
    isAdmin: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ResponseUser[]> {
    const allUsers = this.prisma.user.findMany({
      select: this.allUsersSelect,
    });

    return allUsers;
  }

  async create(dto: CreateUserDto): Promise<ResponseUser> {
    if (dto.confirmPassword !== dto.password) {
      throw {
        name: 'ValidationError',
        message: 'As senhas informadas não conferem',
      };
    }

    delete dto.confirmPassword;
    dto.email === process.env.OWNER_EMAIL
      ? (dto.isAdmin = true)
      : (dto.isAdmin = false);

    const data: User = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };

    return this.prisma.user.create({
      data,
      select: { ...this.userSelect, games: false },
    });
  }

  async findOne(id: string): Promise<ResponseUser> {
    const user = await this.findByID(id, this.userSelect);
    return { ...user, games: user.games.map((game: any) => game.gameId) };
  }

  async update(id: string, dto: UpdateUserDto, user: User) {
    await this.findByID(id, this.userSelect); // Check if user exists

    const superUser = {
      id: await this.getOwnerId(),
      email: process.env.OWNER_EMAIL,
    };

    // Email é do super usuário || Não é super usuário e está tentando atualizar o super usuário
    if (
      dto.email === superUser.email ||
      (user.id !== superUser.id && id === superUser.id)
    )
      throw {
        name: 'UnauthorizedError',
        message: 'Você não tem permissão para atualizar os dados deste usuário',
      };

    if (dto.password) {
      if (dto.confirmPassword !== dto.password) {
        throw {
          name: 'ValidationError',
          message: 'As senhas informadas não conferem',
        };
      }
    }

    delete dto?.confirmPassword;

    const data: UpdateUserDto = {
      name: dto?.name,
      email: dto?.email,
      password: dto?.password,
      cpf: dto?.cpf,
      isAdmin: dto?.isAdmin,
    };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });

    return {
      ...updatedUser,
      games: updatedUser.games.map((game: any) => game.gameId),
    };
  }

  async remove(id: string, user: User): Promise<void> {
    await this.findByID(id, this.userSelect); // Check if user exists
    const superUserId = await this.getOwnerId();

    if (id === superUserId)
      throw {
        name: 'UnauthorizedError',
        message: 'Você não tem permissão para excluir este usuário',
      };

    await this.prisma.user.delete({ where: { id } });
  }

  // ------------------------------------------------------------------------------------------------
  //                                   Métodos adicionais
  // ------------------------------------------------------------------------------------------------

  async findByID(id: string, selection: SelectUser): Promise<ResponseUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: selection,
    });

    if (!user)
      throw {
        name: 'NotFoundError',
        message: `Usuário com ID '${id}' não encontrado`,
      };

    return user;
  }

  async getOwnerId(): Promise<string> {
    const ownerEmail = process.env.OWNER_EMAIL;
    const owner = await this.prisma.user.findUnique({
      where: { email: ownerEmail },
      select: { id: true },
    });

    return owner.id;
  }
}
