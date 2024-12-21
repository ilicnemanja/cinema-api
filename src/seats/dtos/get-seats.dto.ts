import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetSeatsDto {
  @IsOptional()
  @IsEnum(['AVAILABLE', 'RESERVED', 'SOLD'], {
    message: "status must be 'AVAILABLE', 'RESERVED' or 'SOLD'",
  })
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | null;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'showtimeId must be a number' })
  showtimeId: number;
}
