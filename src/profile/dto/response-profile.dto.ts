export class ResponseProfileDto {
  id: string;
  title: string;
  avatarUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
