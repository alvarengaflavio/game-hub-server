import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return `This action returns all homepage`;
  }
}
