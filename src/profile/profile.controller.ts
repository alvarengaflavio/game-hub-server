import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { handleError } from '$/common/helpers/exeption.helper';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { User } from '$/user/entities/user.entity';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';

@ApiTags('profile')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo perfil' })
  async create(@LoggedUser() user: User, @Body() dto: CreateProfileDto) {
    try {
      const newProfile = await this.profileService.create(user.id, dto);
      return newProfile;
    } catch (err) {
      prismaExeptionFilter(err, 'Verifique os dados enviados.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os perfis' })
  findAll() {
    try {
      return this.profileService.findAll();
    } catch (err) {
      handleError({
        name: 'InternalServerError',
        message: err.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um perfil pelo ID' })
  async findOne(@Param('id') id: string) {
    try {
      const profile = await this.profileService.findOne(id);
      return profile;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um perfil pelo ID' })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @LoggedUser() user: User,
  ) {
    try {
      const updatedProfile = await this.profileService.update(
        id,
        updateProfileDto,
        user,
      );

      if (!updatedProfile)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para atualizar este perfil.',
        };

      return updatedProfile;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um perfil pelo ID' })
  @ApiResponse({
    status: 204,
    description: 'Perfil excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil não encontrado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.profileService.remove(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
