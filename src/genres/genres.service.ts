import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ResponseGenres } from './interfaces/response-genres.interface';
import { SelectGenres } from './interfaces/select-genres.interface';

@Injectable()
export class GenresService {
  private readonly selectGenres: SelectGenres = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: false,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto): Promise<ResponseGenres> {
    const data: Prisma.GenresCreateInput = {
      name: dto.name,
    };

    return this.prisma.genres.create({
      data,
      select: this.selectGenres,
    });
  }

  async findAll(): Promise<ResponseGenres[]> {
    return this.prisma.genres.findMany({
      select: { ...this.selectGenres, createdAt: false },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
