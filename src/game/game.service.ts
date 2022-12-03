import { Genre } from '$/genres/entities/genre.entity';
import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { ResponseGame } from './interfaces/response-game.interface';

@Injectable()
export class GameService {
  private readonly selectGame = {
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
  };

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
      select: this.selectGame,
    });
  }

  async findAll(): Promise<ResponseGame[]> {
    const data = await this.prisma.game.findMany({
      select: {
        ...this.selectGame,
        score: false,
        coverUrl: false,
        videoUrl: false,
        createdAt: false,
      },
    });

    return data.map((game) => ({
      ...game,
      genres: game.genres.map((genre) => genre.name),
    }));
  }

  async findOne(id: string): Promise<ResponseGame> {
    const game = await this.findGameById(id);

    return { ...game, genres: game.genres.map((genre) => genre.name) };
  }

  update(id: string, upd: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  async remove(id: string) {
    await this.findGameById(id); // Verifica se o jogo existe
    await this.prisma.game.delete({ where: { id } });
  }

  /*  ********************************************************************************************************************
   *******************************************      Métodos Adicionais      *******************************************
   ******************************************************************************************************************** */

  async findGameById(id: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      select: { ...this.selectGame, updatedAt: true },
    });

    if (!game) {
      throw {
        name: 'NotFoundError',
        message: `Jogo com Id '${id}' não encontrado.`,
      };
    }

    return game;
  }
}
