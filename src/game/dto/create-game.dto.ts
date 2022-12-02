import { Genre } from '$/genres/entities/genre.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the game',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  title: string;

  @IsString()
  @Matches(/^(19[5-9]\d|20[0-4]\d|2050)$/)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The year of the game',
    example: '2017',
  })
  year: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The cover image of the game',
    example: 'https://i.imgur.com/1Q2wYrG.jpg',
  })
  coverUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The video of the game',
    example: 'https://www.youtube.com/watch?v=1h7KV2sjUWY',
  })
  videoUrl: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The score of the game',
    example: 10,
  })
  score?: number;

  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'The genres of the game',
    example: ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'],
  })
  genres: string[];
}
