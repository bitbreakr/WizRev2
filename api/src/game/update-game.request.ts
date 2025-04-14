import { Game, Platform } from './types';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateGameRequest implements Partial<Omit<Game, 'id'>> {
  @IsOptional()
  @IsString()
  public readonly appVersion?: string;

  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  public readonly bundleId?: string;

  @IsOptional()
  @IsBoolean()
  public readonly isPublished?: boolean;

  @IsOptional()
  @IsString()
  public readonly name?: string;

  @IsOptional()
  @IsEnum(Platform)
  public readonly platform?: Platform;

  @IsOptional()
  @IsString()
  public readonly publisherId?: string;

  @IsOptional()
  @IsString()
  public readonly storeId?: string;
}
