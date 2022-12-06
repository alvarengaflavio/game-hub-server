import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoriteService {
  private readonly selectFavorite = {
    id: true,
    profile: {
      select: {
        id: true,
      },
    },
    games: {
      select: {
        id: true,
      },
    },
  };
  constructor(private readonly prisma: PrismaService) {}

  async addGameToFavorite(dto: CreateFavoriteDto, user: User) {
    const isProfileOwner = await this.isProfileOwner(dto.profileId, user.id);

    if (!isProfileOwner && !user.isAdmin) {
      throw {
        name: 'ForbiddenError',
        message: 'You are not allowed to add games to this profile',
      };
    }

    const profileHasFavorites = await this.checkProfileFavorites(dto.profileId);
    await this.findGameById(dto.gameId);

    // SE PERFIL NÃO CONTÉM FAVORITOS
    if (!profileHasFavorites) {
      return this.createFavorite(dto);
    }

    return this.updateFavorite(dto);
  }

  async createFavorite(dto: CreateFavoriteDto) {
    const data: Prisma.FavoriteCreateInput = {
      profile: {
        connect: {
          id: dto.profileId,
        },
      },
      games: {
        connect: {
          id: dto.gameId,
        },
      },
    };

    return this.prisma.favorite.create({
      data,
      select: this.selectFavorite,
    });
  }

  async updateFavorite(dto: UpdateFavoriteDto) {
    const gamesInProfile = await this.checkGamesInProfile(dto.profileId);

    if (gamesInProfile.includes(dto.gameId))
      throw {
        name: 'ConflictError',
        message: `Game com o ID '${dto.gameId}' já está nos favoritos`,
      };

    gamesInProfile.push(dto.gameId);

    const data: Prisma.FavoriteUpdateInput = {
      games: {
        set: gamesInProfile.map((gameId) => ({ id: gameId })),
      },
    };

    return this.prisma.favorite.update({
      where: {
        profileId: dto.profileId,
      },
      data,
      select: this.selectFavorite,
    });
  }

  async findAll() {
    return this.prisma.favorite.findMany({ select: this.selectFavorite });
  }

  async findAllByUserId(userId: string) {
    const profileIds = await this.prisma.profile.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    console.log(profileIds);

    const favorites = await this.prisma.favorite.findMany({
      where: {
        profileId: {
          in: profileIds.map((profile) => profile.id),
        },
      },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
            title: true,
          },
        },
        games: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return favorites;
  }

  async removeGame(user: User, dto: CreateFavoriteDto) {
    const { gameId, profileId } = dto;
    const isOwner = await this.isProfileOwner(profileId, user.id);

    if (!isOwner && !user.isAdmin) {
      throw {
        name: 'ForbiddenError',
        message: 'You are not allowed to remove this game from favorites',
      };
    }

    const gamesInProfile = await this.checkGamesInProfile(profileId);

    if (!gamesInProfile.includes(gameId)) {
      throw {
        name: 'NotFoundError',
        message: `Game com o ID '${gameId}' não encontrado nos favoritos`,
      };
    }

    const newGames = gamesInProfile.filter((game) => game !== gameId);

    const data: Prisma.FavoriteUpdateInput = {
      games: {
        set: newGames.map((gameId) => ({ id: gameId })),
      },
    };

    return this.prisma.favorite.update({
      where: {
        profileId,
      },
      data,
      select: this.selectFavorite,
    });
  }

  async removeFavorite(id: string, user: User) {
    const ownerId = await this.findFavoriteOwner(id);

    if (ownerId !== user.id && !user.isAdmin) {
      throw {
        name: 'ForbiddenError',
        message: 'You are not allowed to remove this favorite',
      };
    }

    return this.prisma.favorite.delete({
      where: {
        id,
      },
      select: this.selectFavorite,
    });
  }

  /*  ********************************************************************************************************************
   *******************************************      Métodos Adicionais      *******************************************
   ******************************************************************************************************************** */

  async isProfileOwner(profileId: string, userId: string) {
    const profileOwner = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        userId: true,
      },
    });

    if (!profileOwner) {
      throw {
        name: 'NotFoundError',
        message: `Perfil com o ID '${profileId}' não encontrado`,
      };
    }

    return profileOwner.userId !== userId ? false : true;
  }

  // return all gameId's from a profile
  async checkGamesInProfile(profileId: string) {
    const games = await this.prisma.favorite.findUnique({
      where: {
        profileId,
      },
      select: {
        games: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!games)
      throw {
        name: 'NotFoundError',
        message: `Nenhum jogo encontrado no perfil com o ID '${profileId}'`,
      };

    return games?.games?.map((game) => game.id);
  }

  // check if the game exists
  async findGameById(gameId: string) {
    const isGameExists = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!isGameExists) {
      throw {
        name: 'NotFoundError',
        message: 'Game not found',
      };
    }

    return isGameExists ? true : false;
  }

  async findFavoriteOwner(favoriteId: string) {
    const favoriteOwner = await this.prisma.favorite.findUnique({
      where: {
        id: favoriteId,
      },
      select: {
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!favoriteOwner) {
      throw {
        name: 'NotFoundError',
        message: `Favorite com o ID '${favoriteId}' não encontrado`,
      };
    }

    return favoriteOwner.profile.userId;
  }

  async checkProfileFavorites(profileId: string) {
    const profileHasFavorites = await this.prisma.favorite.findMany({
      where: {
        profileId,
      },
    });

    return profileHasFavorites.length > 0 ? true : false;
  }
}
