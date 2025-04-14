import { Game, Platform } from './types';
import { IsBoolean, IsEnum, IsString, IsUrl } from 'class-validator';

export class CreateGameRequest implements Omit<Game, 'id'> {
  @IsString()
  public readonly appVersion: string;

  @IsUrl({
    require_tld: false,
  })
  public readonly bundleId: string;

  @IsBoolean()
  public readonly isPublished: boolean;

  @IsString()
  public readonly name: string;

  @IsEnum(Platform)
  public readonly platform: Platform;

  @IsString()
  public readonly publisherId: string;

  @IsString()
  public readonly storeId: string;
}
