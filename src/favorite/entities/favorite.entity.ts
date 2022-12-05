import { Game } from '$/game/entities/game.entity';

export class Favorite {
  id?: string;
  profileId: string;
  games: Game[];
  createdAt?: Date;
  updatedAt?: Date;
}
