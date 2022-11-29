import { handleError } from '$/utils/error-handler.util';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-responde.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login de um usuário' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.authService.login(loginDto);

      if (!user)
        throw {
          name: 'UnauthorizedError',
          message: 'Usuário e/ou senha inválidos',
        };

      return user;
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}
