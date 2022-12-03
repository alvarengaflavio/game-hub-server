import { Genre } from '$/genres/entities/genre.entity';

export class Game {
  id: string;
  title: string;
  genres: Genre[];
  year: string;
  developer?: string;
  coverUrl: string;
  videoUrl: string;
  score?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
