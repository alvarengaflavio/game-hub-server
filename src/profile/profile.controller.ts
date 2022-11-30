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
import { buildPrismaError, handleError } from '$/utils/error-handler.util';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from '$/auth/logged-user.decorator';
import { User } from '$/user/entities/user.entity';

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
      console.log(err);

      buildPrismaError(err, 'Verifique os dados enviados.');
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
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um perfil pelo ID' })
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
