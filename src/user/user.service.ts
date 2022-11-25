import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  constructor(private readonly prisma: PrismaService) {}

  findAll(): User[] {
    return this.users;
  }

  create(user: CreateUserDto): User {
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      ...user,
    };

    this.users.push(newUser);
    return newUser;
  }
}
