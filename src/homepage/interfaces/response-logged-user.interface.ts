export class ResponseLoggedUser {
  id?: string;
  name?: string;
  email?: string;
  cpf?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  profiles?: {
    id?: string;
    title?: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    favorites?: string[];
  }[];
  games?: {
    id?: string;
    title?: string;
    genres?: string[];
    year?: string;
    developer?: string;
    score?: number;
    price?: number;
    coverUrl?: string;
    videoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}
