import { PrismaService } from '$/prisma/prisma.service';
import { User } from '$/user/entities/user.entity';
import { handleError } from '$/common/helpers/exeption.helper';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { email: string }): Promise<User> {
    const { email } = payload;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user)
      handleError({
        name: 'UnauthorizedError',
        message: 'Usuário não encontrado',
      });

    delete user.password;

    return user;
  }
}
