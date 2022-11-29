import { PrismaService } from '$/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-responde.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Procura e checa se o usuário existe, usando email
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // Checa se a senha enviada é igual a senha do usuário
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) return null;

    delete user.password;

    return {
      token: this.jwtService.sign({ id: user.id }),
      user,
    };
  }
}
