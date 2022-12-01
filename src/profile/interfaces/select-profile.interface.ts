export class SelectProfile {
  id: boolean;
  title: boolean;
  avatarUrl: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  user: {
    select: {
      id: boolean;
      name: boolean;
      email: boolean;
    };
  };
}
