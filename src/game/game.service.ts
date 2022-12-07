import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AddGameDto } from './dto/add-game-dto';
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
    developer: false,
    score: true,
    price: true,
    coverUrl: true,
    videoUrl: true,
    createdAt: true,
    updatedAt: false,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto): Promise<ResponseGame> {
    const data: Prisma.GameCreateInput = {
      title: dto?.title,
      year: dto?.year,
      developer: dto?.developer,
      coverUrl: dto?.coverUrl,
      videoUrl: dto?.videoUrl,
      score: dto?.score,
      price: dto?.price,

      genres: {
        connect: dto.genres.map((name) => ({ name })),
      },
    };

    const newGame = await this.prisma.game.create({
      data,
      select: { ...this.selectGame, developer: true },
    });

    return { ...newGame, genres: newGame.genres.map((genre) => genre.name) };
  }

  async findAll(): Promise<ResponseGame[]> {
    const data = await this.prisma.game.findMany({
      select: {
        ...this.selectGame,
        developer: false,
        score: false,
        coverUrl: false,
        videoUrl: false,
        createdAt: false,
      },
    });

    return data.map((game) => ({
      ...game,
      genres: game?.genres?.map((genre) => genre.name),
    }));
  }

  async findOne(id: string): Promise<ResponseGame> {
    const game = await this.findGameById(id);

    return { ...game, genres: game.genres.map((genre) => genre.name) };
  }

  async update(id: string, dto: UpdateGameDto) {
    await this.findGameById(id); // Verifica se o jogo existe

    const data: Prisma.GameUpdateInput = {
      title: dto.title,
      year: dto.year,
      developer: dto?.developer,
      score: dto?.score,
      price: dto?.price,
      coverUrl: dto?.coverUrl,
      videoUrl: dto?.videoUrl,

      genres: {
        set: dto?.genres?.map((name) => ({ name })),
      },
    };

    // checa se existe alguma chave válida no dto
    const filter = Object.keys(dto)
      .map((dtoKey) =>
        Object.keys(data).filter((gameKey) => gameKey === dtoKey),
      )
      .flat();

    // se não existir, retorna erro
    if (filter.length === 0) {
      throw {
        name: 'BadRequestError',
        message: 'Nenhum dado válido foi informado.',
      };
    }

    const updatedGame = await this.prisma.game.update({
      where: { id },
      data,
      select: { ...this.selectGame, developer: true, updatedAt: true },
    });

    return {
      ...updatedGame,
      genres: updatedGame.genres.map((genre) => genre.name),
    };
  }

  async remove(id: string) {
    await this.findGameById(id); // Verifica se o jogo existe
    await this.prisma.game.delete({ where: { id } });
  }

  async addGameToUser(dto: AddGameDto, user: User) {
    const { gameId, userId } = dto;
    if (user.id !== userId && !user.isAdmin)
      throw {
        name: 'ForbiddenError',
        message: 'Você não tem permissão para adicionar jogos a este usuário.',
      };

    await this.findGameById(gameId); // Verifica se o jogo existe
    await this.findUserById(userId); // Verifica se o usuário existe

    const newGame = await this.prisma.userGame.create({
      data: {
        game: {
          connect: { id: gameId },
        },
        user: {
          connect: { id: userId },
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        game: {
          select: {
            id: true,
            title: true,
            genres: {
              select: {
                name: true,
              },
            },
            year: true,
            developer: true,
            score: true,
            price: true,
            coverUrl: true,
            videoUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      ...newGame.user,
      games: [
        {
          ...newGame.game,
          genres: newGame.game.genres.map((genre) => genre.name),
        },
      ],
    };
  }
  /*  ********************************************************************************************************************
   *******************************************      Métodos Adicionais      *******************************************
   ******************************************************************************************************************** */

  async findGameById(id: string): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      select: {
        ...this.selectGame,
        developer: true,
        updatedAt: true,
      },
    });

    if (!game) {
      throw {
        name: 'NotFoundError',
        message: `Jogo com Id '${id}' não encontrado.`,
      };
    }

    return game;
  }

  async findUserById(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw {
        name: 'NotFoundError',
        message: `Usuário com Id '${id}' não encontrado.`,
      };
    }
  }
}
