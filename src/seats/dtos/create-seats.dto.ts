import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSeatsDto {
  @IsNumber()
  @IsNotEmpty()
  row_number: number;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  hall_id: number;
}
