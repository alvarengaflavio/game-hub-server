import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface UserSelect {
  id?: boolean;
  name?: boolean;
  email?: boolean;
}

export interface UserDetailed extends UserSelect {
  cpf: boolean;
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
    isAdmin: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ select: this.userSelect });
  }

  create(dto: CreateUserDto): Promise<User> {
    const data: CreateUserDto = {
      ...dto,
    };

    return this.prisma.user.create({ data, select: this.userDetailedSelect });
  }

  async findOne(id: string): Promise<UserSelect | UserDetailed> {
    const user = await this.findByID(id, this.userDetailedSelect);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findByID(id, this.userDetailedSelect);
    if (!user) return null;

    const data: UpdateUserDto = {
      ...dto,
    };

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userDetailedSelect,
    });
  }

  async remove(id: string): Promise<void> {
    const deletedUser = await this.findByID(id, this.userSelect);

    if (!deletedUser) return null;

    await this.prisma.user.delete({ where: { id }, select: this.userSelect });
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

    return user;
  }
}
