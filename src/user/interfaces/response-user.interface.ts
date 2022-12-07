export class ResponseUser {
  id?: string;
  name?: string;
  email?: string;
  cpf?: string;
  profiles?: {
    id?: string;
    title?: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
  games?: {
    id?: string;
    title?: string;
  }[];
  _count?: {
    profiles?: number;
    games?: number;
  };
  password?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
