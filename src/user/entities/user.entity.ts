import { Profile } from "$/profile/entities/profile.entity";

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  cpf?: string;
  isAdmin?: boolean;
  profiles?: Profile[];
  createdAt?: Date;
  updatedAt?: Date;
}
