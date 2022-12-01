export class ResponseUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  profiles: {
    id: string;
    title: string;
    avatarUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
  password?: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
