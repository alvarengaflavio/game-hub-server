export class ResponseGame {
  id: string;
  title: string;
  year: string;
  genres: string[];
  score?: number;
  coverUrl?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}