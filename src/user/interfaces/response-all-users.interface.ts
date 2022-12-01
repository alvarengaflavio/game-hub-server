export class ResponseAllUsers {
  id: string;
  name: string;
  email: string;
  cpf: string;
  _count: {
    profiles: number;
  };
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
