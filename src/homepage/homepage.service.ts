import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ResponseLoggedUser } from './interfaces/response-logged-user.interface';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async findLoggedUser(user: User): Promise<ResponseLoggedUser> {
    const data = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profiles: {
          include: {
            favorites: {
              include: {
                games: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
        games: {
          select: {
            game: {
              select: {
                id: true,
                title: true,
                genres: true,
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
        },
      },
    });

    return this.refactorFindLoggedData(data);
  }

  async findAllAdmin(user: User) {
    return `This action returns all homepage`;
  }

  /*  ********************************************************************************************************************
   *******************************************      Métodos Adicionais      *******************************************
   ******************************************************************************************************************** */

  refactorFindLoggedData(data: any): ResponseLoggedUser {
    delete data.password;

    const profiles = data.profiles.map((profile: any) => {
      delete profile.userId;
      return {
        ...profile,
        favorites: profile.favorites
          .map((favorite: any) => favorite.games.map((game: any) => game.id))
          .flat(),
      };
    });

    const games = data.games.map((game: any) => {
      return {
        ...game.game,
        genres: game.game.genres.map((genre: any) => genre.name),
      };
    });

    return {
      ...data,
      profiles: profiles,
      games: games,
    };
  }
}
