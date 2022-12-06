import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
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
  @ApiOperation({ summary: 'Adicionar um jogo para a lista de  favoritos' })
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
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os favoritos' })
  async findAll() {
    try {
      return await this.favoriteService.findAll();
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um jogo da lista de favoritos',
    description:
      'O usuário pode remover um jogo da lista de favoritos através do ID do jogo.',
  })
  async remove(@LoggedUser() user: User, @Param('id') id: string) {
    try {
      return await this.favoriteService.remove(id, user);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
