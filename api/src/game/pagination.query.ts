import { Pagination } from './types';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQuery implements Pagination {
  @IsOptional()
  @IsNumber()
  @Transform((obj) => Number(obj.value))
  public readonly page: number;

  @IsOptional()
  @IsNumber()
  @Transform((obj) => Number(obj.value))
  public readonly pageSize: number;
}
