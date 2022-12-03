export class ResponseGame {
  id: string;
  title: string;
  year: string;
  developer?: string;
  genres: string[];
  score?: number;
  price?: number;
  coverUrl?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
