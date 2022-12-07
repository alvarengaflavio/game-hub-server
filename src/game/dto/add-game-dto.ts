import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddGameDto {
  @IsUUID('all', { message: 'O ID do Game deve ser um UUID válido.' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID do jogo.',
    example: '1c882e38-bc75-45ed-8999-0d2db539cdde',
  })
  gameId: string;

  @IsUUID('all', { message: 'O ID do usuário deve ser um UUID válido.' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID do usuário.',
    example: 'a91a05b8-bf2a-4edb-97e8-fabaed7692cb',
  })
  userId: string;
}
