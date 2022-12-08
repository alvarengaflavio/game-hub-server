import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User) {
    return `This action returns all homepage`;
  }

  async findAllAdmin(user: User) {
    return `This action returns all homepage`;
  }
}
