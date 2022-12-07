import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { prismaExeptionFilter } from '$/common/helpers/prisma-exeption.filter';
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);

      return newUser;
    } catch (err) {
      prismaExeptionFilter(err, 'Verifique os dados enviados.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista contendo todos os usuários',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      handleError({
        name: 'InternalServerError',
        message: err.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado e listado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);

      return user;
    } catch (err) {
      console.log(err);

      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @LoggedUser() user: User,
  ) {
    try {
      // Não admin tornando admin
      if (!user.isAdmin && dto.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message:
            'Você não tem permissão para tornar um usuário administrador',
        };

      // Não é o próprio usuário e não é admin
      if (id !== user.id && !user.isAdmin)
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para atualizar este usuário',
        };

      const updatedUser = await this.userService.update(id, dto, user);

      return updatedUser;
    } catch (err) {
      prismaExeptionFilter(err, 'Verifique os dados enviados.');
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir um usuário pelo ID' })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @LoggedUser() user: User) {
    try {
      if (!user.isAdmin && id !== user.id)
        // Não é admin e não é o próprio usuário
        throw {
          name: 'UnauthorizedError',
          message: 'Você não tem permissão para excluir este usuário',
        };

      await this.userService.remove(id, user);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
