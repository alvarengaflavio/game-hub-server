import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
import { User } from '$/user/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

@ApiTags('game')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo jogo' })
  async create(@LoggedUser() user: User, @Body() dto: CreateGameDto) {
    try {
      if (!user.isAdmin) {
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para criar um jogo.',
        };
      }

      const newGame = await this.gameService.create(dto);

      return newGame;
    } catch (err) {
      prismaExeptionFilter(
        err,
        'Nome do jogo já existe ou lista de gêneros contém gênero(s) inválido(s).',
      );
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os jogos' })
  async findAll() {
    try {
      const games = await this.gameService.findAll();
      return games;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um jogo pelo id' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.gameService.findOne(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() upd: UpdateGameDto) {
    return this.gameService.update(id, upd);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um Jogo pelo ID' })
  async remove(@LoggedUser() user: User, @Param('id') id: string) {
    try {
      if (!user.isAdmin) {
        throw {
          name: 'UnauthorizedError',
          message: 'Apenas administradores podem excluir um jogo.',
        };
      }

      await this.gameService.remove(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
