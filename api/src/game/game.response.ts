import { Game, Platform } from './types';

export class GameResponse implements Game {
  public readonly appVersion: string;

  public readonly bundleId: string;

  public readonly id: string;

  public readonly isPublished: boolean;

  public readonly name: string;

  public readonly platform: Platform;

  public readonly publisherId: string;

  public readonly storeId: string;

  constructor(partial: Partial<GameResponse>) {
    Object.assign(this, partial);
  }
}
