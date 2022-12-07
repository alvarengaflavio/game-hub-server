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
import { AddGameDto } from './dto/add-game-dto';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';
import { ResponseGame } from './interfaces/response-game.interface';

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
        'Nome do jogo já existe ou lista de gêneros contém gênero inválido.',
      );
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os jogos' })
  async findAll(): Promise<ResponseGame[]> {
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
  async findOne(@Param('id') id: string): Promise<ResponseGame> {
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
  @ApiOperation({
    summary: 'Atualizar um Jogo pelo ID',
    description: 'Atualizar uma ou mais informação de um Jogo pelo ID.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
    @LoggedUser() user: User,
  ): Promise<ResponseGame> {
    try {
      if (!user.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para atualizar um jogo.',
        };

      return await this.gameService.update(id, dto);
    } catch (err) {
      prismaExeptionFilter(
        err,
        'Nome do jogo já existe ou lista de gêneros contém gênero inválido.',
      );
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Post('usergame')
  @ApiOperation({
    summary: 'Adicionar um JOGO a um USUÁRIO',
    description:
      'Adicionar um jogo a um usuário através do ID de ambos. O usuário deve estar logado.',
  })
  async addGameToUser(@Body() dto: AddGameDto, @LoggedUser() user: User) {
    try {
      return await this.gameService.addGameToUser(dto, user);
    } catch (err) {
      prismaExeptionFilter(
        err,
        'O jogo já está na sua lista ou o jogo não existe.',
      );
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um Jogo pelo ID' })
  async remove(
    @LoggedUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      if (!user.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para excluir um jogo.',
        };

      await this.gameService.remove(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
