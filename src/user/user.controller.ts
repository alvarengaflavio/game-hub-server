import { buildPrismaError, handleError } from '$/utils/error-handler.util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
      if (err.code === 'P2002') buildPrismaError(err, 'Email já cadastrado');

      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista um usuário pelo ID' })
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
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
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
      if (err instanceof PrismaClientValidationError)
        buildPrismaError(
          err,
          'Erro de validação. Verifique os dados enviados.',
        );

      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(id);

      return {
        statusCode: 200,
        message: 'Usuário deletado com sucesso',
      };
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
