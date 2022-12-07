import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddGameDto {
  @IsUUID('all', { message: 'O ID do Game deve ser um UUID válido.' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID do jogo.',
    example: 'c0a80aa6-7dec-11eb-9439-0242ac130003',
  })
  gameId: string;

  @IsUUID('all', { message: 'O ID do usuário deve ser um UUID válido.' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID do usuário.',
    example: 'c0a80aa6-7dec-11eb-9439-0242ac130003',
  })
  userId: string;
}
