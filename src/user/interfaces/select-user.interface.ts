export class SelectUser {
  id: boolean;
  name: boolean;
  email: boolean;
  cpf: boolean;
  profiles: {
    select: {
      id: boolean;
      title: boolean;
      avatarUrl: boolean;
      createdAt: boolean;
      updatedAt: boolean;
    };
  };
  password: boolean;
  isAdmin: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}
