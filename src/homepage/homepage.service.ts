import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ResponseAdmin } from './interfaces/response-admin.interface';
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

  async findAllAdmin(): Promise<ResponseAdmin[]> {
    const data = await this.prisma.user.findMany({
      where: {},
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,

        profiles: {
          select: {
            id: true,
            title: true,
            favorites: {
              select: {
                _count: {
                  select: {
                    games: true,
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
              },
            },
          },
        },
      },
    });

    return this.refactorFindAllAdminData(data);
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

    const games = data.games.map((game: any) => ({
      ...game.game,
      genres: game.game.genres.map((genre: any) => genre.name),
    }));

    return {
      ...data,
      profiles: profiles,
      games: games,
    };
  }

  refactorFindAllAdminData(data: any[]): ResponseAdmin[] {
    const newData: ResponseAdmin[] = data.map((user: any) => ({
      ...user,
      profiles: user.profiles.map((profile: any) => ({
        ...profile,
        favorites: profile.favorites.reduce((acc: any, favorite: any) => {
          return acc + favorite._count.games;
        }, 0),
      })),
      games: user.games.map((game: any) => ({ ...game.game })),
    }));

    return newData;
  }
}
