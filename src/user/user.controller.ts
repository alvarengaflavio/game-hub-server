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
  findAll() {
    try {
      return this.userService.findAll();
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
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, dto);

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
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
