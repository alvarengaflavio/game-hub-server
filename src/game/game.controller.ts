import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { User } from '$/user/entities/user.entity';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
import { Game } from '@prisma/client';

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
      if (!user.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para criar um jogo.',
        };

      const newGame = await this.gameService.create(dto);

      return newGame;
    } catch (err) {
      prismaExeptionFilter(err, 'Verifique os dados enviados.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
