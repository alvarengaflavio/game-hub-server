import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUppercase } from 'class-validator';

export class CreateGenreDto {
  @IsUppercase({
    message: 'O nome do gênero deve estar em maiúsculo',
    each: true,
  })
  @IsNotEmpty({
    message: 'O nome do gênero não pode ser vazio',
  })
  @ApiProperty({
    example: 'ACTION RPG',
    description: 'O nome do gênero do jogo com letras maiúsculas',
  })
  name: string;
}
