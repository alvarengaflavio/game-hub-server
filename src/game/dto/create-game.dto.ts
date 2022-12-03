import { Genre } from '$/genres/entities/genre.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'O título do jogo',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  title: string;

  @IsString()
  @Matches(/^(19[5-9]\d|20[0-4]\d|2050)$/)
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ano de lançamento do jogo',
    example: '2017',
  })
  year: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'A desenvolvedora do jogo',
    example: 'Nintendo',
  })
  developer: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A URL da capa do jogo',
    example: 'https://i.imgur.com/1Q2wYrG.jpg',
  })
  coverUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'O URL do trailer do jogo',
    example: 'https://www.youtube.com/watch?v=1h7KV2sjUWY',
  })
  videoUrl: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'A nota do jogo',
    example: 10,
  })
  score?: number;

  @IsString({ each: true })
  @IsUppercase({ each: true })
  @ApiProperty({
    description: 'Os gêneros do jogo',
    example: ['ADVENTURE', 'ACTION RPG', 'RPG'],
  })
  genres: string[];
}
