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
    isAdmin: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<{ id: string; name: string; email: string }[]> {
    return this.prisma.user.findMany({ select: this.allUsersSelect });
  }

  async create(dto: CreateUserDto): Promise<ResponseUser> {
    if (dto.confirmPassword !== dto.password)
      throw {
        name: 'ValidationError',
        message: 'As senhas informadas não conferem',
      };

    delete dto.confirmPassword;

    const data: User = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };

    return this.prisma.user.create({
      data,
      select: this.userSelect,
    });
  }

  async findOne(id: string): Promise<ResponseUser> {
    const user = await this.findByID(id, this.userSelect);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findByID(id, this.userSelect);

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
      ...dto,
    };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findByID(id, this.userSelect);
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
}
