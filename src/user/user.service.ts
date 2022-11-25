import { PrismaService } from '$/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.userDetailedSelect,
    });
  }

  update(id: string, dto: UpdateUserDto) {
    const user = this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const data: UpdateUserDto = {
      ...dto,
    };

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userDetailedSelect,
    });
  }
}
