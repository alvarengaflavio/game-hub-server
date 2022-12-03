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
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { User } from '$/user/entities/user.entity';
import { ResponseGenres } from './interfaces/response-genres.interface';

@ApiTags('genres')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo gênero' })
  async create(@LoggedUser() user: User, @Body() dto: CreateGenreDto) {
    try {
      if (!user.isAdmin) {
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para criar um gênero.',
        };
      }

      const newGenre = await this.genresService.create(dto);

      return newGenre;
    } catch (err) {
      prismaExeptionFilter(err, 'Nome do gênero já existe.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os gêneros' })
  async findAll(): Promise<string[]> {
    try {
      const genres = this.genresService.findAll();

      return genres;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Buscar um gênero pelo NOME',
    description:
      'Buscar um gênero pelo seu NOME. Não é necessário passar o ID. O nome deve ser passado na URL com o parâmetro "name" e com todas as letras maiúsculas.',
  })
  async findOne(@Param('name') name: string) {
    try {
      return await this.genresService.findOne(name.toUpperCase());
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }
}
