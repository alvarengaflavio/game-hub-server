import { Genre } from '$/genres/entities/genre.entity';

export class Game {
  id: string;
  title: string;
  coverUrl: string;
  videoUrl: string;
  year: string;
  score?: number;
  genres: Genre[];

  createdAt?: Date;
  updatedAt?: Date;
}
