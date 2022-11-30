import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface UserSelect {
  id?: boolean;
  name?: boolean;
  email?: boolean;
}

export interface UserDetailed extends UserSelect {
  cpf: boolean;
  password?: boolean;
  profiles: boolean;
  isAdmin: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

@Injectable()
export class UserService {
  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
  };

  private readonly userDetailedSelect = {
    ...this.userSelect,
    cpf: true,
    profiles: true,
    password: false,
    isAdmin: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<{ id: string; name: string; email: string }[]> {
    return this.prisma.user.findMany({ select: this.userSelect });
  }

  async create(dto: CreateUserDto): Promise<User> {
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
      select: this.userDetailedSelect,
    });
  }

  async findOne(id: string): Promise<UserSelect | UserDetailed> {
    const user = await this.findByID(id, this.userDetailedSelect);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findByID(id, this.userDetailedSelect);

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
      select: this.userDetailedSelect,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findByID(id, this.userSelect);
    await this.prisma.user.delete({ where: { id } });
  }

  // ------------------------------------------------------------------------------------------------
  //                                   Métodos adicionais
  // ------------------------------------------------------------------------------------------------

  async findByID(
    id: string,
    selection: UserSelect | UserDetailed,
  ): Promise<UserSelect | UserDetailed> {
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
