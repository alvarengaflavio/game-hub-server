export class ResponseProfile {
  id?: string;
  title?: string;
  avatarUrl?: string;
  favorites?: string[];
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
