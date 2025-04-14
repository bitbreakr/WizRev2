import { GameResponse } from './game.response';
import { Transform } from 'class-transformer';
import { Game } from './types';

export class PaginatedGameResponse {
  public count: number;

  @Transform((obj) => obj.value.map((cursor: Game) => new GameResponse(cursor)))
  public data: GameResponse[];

  constructor(partial: Partial<PaginatedGameResponse>) {
    Object.assign(this, partial);
  }
}
