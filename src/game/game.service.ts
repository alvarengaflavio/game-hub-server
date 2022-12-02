import { Genre } from '$/genres/entities/genre.entity';
import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto): Promise<Game> {
    const data: Prisma.GameCreateInput = {
      title: dto.title,
      year: dto.year,
      coverUrl: dto.coverUrl,
      videoUrl: dto.videoUrl,
      score: dto.score,

      genres: {
        connect: dto.genres.map((name) => ({ name })),
      },
    };

    return this.prisma.game.create({
      data,
      select: {
        id: true,
        title: true,
        genres: {
          select: {
            name: true,
          },
        },
        year: true,
        score: true,
        coverUrl: true,
        videoUrl: true,
        createdAt: true,
        updatedAt: false,
      },
    });
  }

  async findAll(): Promise<
    {
      genres: string[];
      id: string;
      title: string;
      year: string;
    }[]
  > {
    const data = await this.prisma.game.findMany({
      select: {
        id: true,
        title: true,
        genres: {
          select: {
            name: true,
          },
        },
        year: true,
        score: false,
        coverUrl: false,
        videoUrl: false,
        createdAt: false,
        updatedAt: false,
      },
    });

    return data.map((game) => ({
      ...game,
      genres: game.genres.map((genre) => genre.name),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
