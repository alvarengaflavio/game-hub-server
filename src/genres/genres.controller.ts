import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
import { User } from '$/user/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';

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
      prismaExeptionFilter(err, 'O nome do gênero já existe.');
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGenreDto,
    @LoggedUser() user: User,
  ) {
    try {
      if (!user.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para atualizar um gênero.',
        };

      const updatedGenre = await this.genresService.update(id, dto);

      return updatedGenre;
    } catch (err) {
      prismaExeptionFilter(err, 'O nome do gênero já existe.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }
}
