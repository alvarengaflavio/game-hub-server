import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleError } from '$/utils/error-handler.util';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuário' })
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
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);

      if (!newUser)
        throw {
          name: 'InternalServerError',
          message: 'Não foi possível criar o usuário',
        };

      return newUser;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista um usuário pelo ID' })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);

      if (user === null)
        throw {
          name: 'NotFoundError',
          message: 'Usuário não encontrado',
        };

      return this.userService.findOne(id);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, dto);

      if (updatedUser === null)
        throw {
          name: 'NotFoundError',
          message: `Usuário com ID ${id} não encontrado`,
        };

      return updatedUser;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  async remove(@Param('id') id: string) {
    try {
      const deletedUser = await this.userService.remove(id);

      if (deletedUser === null)
        throw {
          name: 'NotFoundError',
          message: `Usuário com ID ${id} não encontrado`,
        };

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
