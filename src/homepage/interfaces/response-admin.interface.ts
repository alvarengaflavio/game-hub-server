export class ResponseAdmin {
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
    _count?: {
      favorites?: number;
    };
  }[];

  games?: {
    id?: string;
    title?: string;
  }[];
}
