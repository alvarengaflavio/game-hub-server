export class SelectAllUsers {
  id: boolean;
  name: boolean;
  email: boolean;
  cpf: boolean;
  password: boolean;
  _count: {
    select: {
      profiles: boolean;
    };
  };
  isAdmin: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}
