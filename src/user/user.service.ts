import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  create(user: CreateUserDto) {
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      ...user,
    };

    this.users.push(newUser);
    return newUser;
  }
}
