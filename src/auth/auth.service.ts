import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-responde.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    return {
      token: 'token teste',
      user: undefined,
    };
  }
}
