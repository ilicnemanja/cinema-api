import { IsNumber } from 'class-validator';

export class CreateSeatsDto {
  @IsNumber()
  row_number: number;

  @IsNumber()
  number: number;

  @IsNumber()
  hallId: number;
}
