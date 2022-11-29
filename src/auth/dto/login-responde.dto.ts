import { User } from '$/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acesso gerado pelo login',
    example: 'eyJhbGci  ...  1fQ', // jwt token
  })
  token: string;

  @ApiProperty({
    description: 'Informações do usuário logado',
    type: User,
  })
  user: User;
}
