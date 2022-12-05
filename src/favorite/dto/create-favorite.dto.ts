import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID('all', {
    message: 'profileId deve ser um UUID válido',
  })
  @IsNotEmpty({ message: 'profileId não pode ser vazio' })
  @ApiProperty({
    description: 'ID do perfil do usuário',
    example: '797b681b-76d6-4ec5-a1b5-bab3eb22f844',
  })
  profileId: string;

  @IsUUID('all', {
    message: 'gameId deve ser um UUID válido',
  })
  @IsNotEmpty({ message: 'gameId não pode ser vazio' })
  @ApiProperty({
    description: 'Id do jogo a ser adicionado aos favoritos',
    example: '134e4e25-39c1-43c3-b3af-cd9d7f2fb44d',
  })
  games: string;
}
