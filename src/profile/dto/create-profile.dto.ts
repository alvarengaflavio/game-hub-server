import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'O nome do perfil',
    example: 'Chicken Face',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'A URL da imagem do perfil',
    example:
      'https://media.discordapp.net/attachments/780200279772626944/1046743073209724928/iYsYcLMR_400x400.jpg',
  })
  avatarUrl: string;
}
