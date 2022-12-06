export class SelectProfile {
  id: boolean;
  title: boolean;
  avatarUrl: boolean;
  favorites?: {
    select: {
      id?: boolean;
      games?: {
        select: {
          id?: boolean;
          title?: boolean;
        };
      };
    };
  };
  user: {
    select: {
      id: boolean;
      name: boolean;
      email: boolean;
    };
  };
  createdAt: boolean;
  updatedAt: boolean;
}
