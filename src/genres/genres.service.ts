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

  async findAll(): Promise<string[]> {
    const genres = await this.prisma.genres.findMany({
      select: { ...this.selectGenres, createdAt: false, id: false },
      orderBy: { name: 'asc' },
    });

    return genres.map((genre) => genre.name);
  }

  async findOne(name: string) {
    const genre = await this.findByName(name);

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  async remove(id: number) {
    return `This action removes a #${id} genre`;
  }

  /*  ************************************************************************
   **********************     Métodos Adicionais     **********************
   ************************************************************************  */

  async findByName(name: string): Promise<ResponseGenres> {
    const foundGenre = await this.prisma.genres.findUnique({
      where: { name },
      select: { ...this.selectGenres, updatedAt: true },
    });

    if (!foundGenre)
      throw {
        name: 'NotFoundError',
        message: `Gênero com o nome '${name}' não encontrado`,
      };

    return foundGenre;
  }
}
