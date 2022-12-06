import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteService } from './favorite.service';

@ApiTags('favorite')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({
    summary: 'Adicionar um jogo para a lista de favoritos de um perfil',
    description:
      'Adicionar um jogo para a lista de favoritos de um perfil. É necessário que o usuário seja o dono do perfil ou um administrador.',
  })
  async addGameToFavorite(
    @LoggedUser() user: User,
    @Body() dto: CreateFavoriteDto,
  ) {
    try {
      const newFavorite = await this.favoriteService.addGameToFavorite(
        dto,
        user,
      );

      return newFavorite;
    } catch (err) {
      prismaExeptionFilter(err, 'Erro ao criar Favorito');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os favoritos',
    description:
      'Listar todos os favoritos. Se administrador lista todos os perfis com seus favoritos, se usuário comum lista apenas os favoritos dos perfis que pertencem ao usuário logado.',
  })
  async findAll(@LoggedUser() user: User) {
    try {
      if (user.isAdmin) {
        return await this.favoriteService.findAll();
      }

      return await this.favoriteService.findAllByUserId(user.id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar favoritos de um perfil',
    description:
      'Listar favoritos de um perfil. É necessário que o usuário seja o dono do perfil ou um administrador.',
  })
  async findOneProfile(@LoggedUser() user: User, @Param('id') id: string) {
    try {
      return await this.favoriteService.findOneProfile(id, user);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete()
  @ApiOperation({
    summary: 'Remover um jogo da lista de favoritos',
    description:
      'O usuário pode remover um jogo da lista de favoritos de um perfil. É necessário que o usuário seja o dono do perfil ou um administrador.',
  })
  async removeGame(@LoggedUser() user: User, @Body() dto: CreateFavoriteDto) {
    try {
      return await this.favoriteService.removeGame(user, dto);
    } catch (err) {
      console.log(err);

      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Remover todos os favoritos de um perfil pelo ID do perfil',
    description:
      'Remover todos os favoritos de um perfil pelo ID do perfil. É necessário que o usuário seja o dono do perfil ou um administrador.',
  })
  async removeFavorite(@LoggedUser() user: User, @Param('id') id: string) {
    try {
      return await this.favoriteService.removeFavorite(id, user);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
