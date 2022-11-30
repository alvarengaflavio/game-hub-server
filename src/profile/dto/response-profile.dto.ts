export class ResponseProfileDto {
  id: string;
  title: string;
  avatarUrl: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
