export class SelectProfileDto {
  id: boolean;
  title: boolean;
  avatarUrl: boolean;
  user: {
    select: {
      id: boolean;
      name: boolean;
      email: boolean;
    };
  };
}
