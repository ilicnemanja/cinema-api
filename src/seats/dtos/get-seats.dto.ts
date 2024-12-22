import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetSeatsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'showtimeId must be a number' })
  showtimeId: number;
}
