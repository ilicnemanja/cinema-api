import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  showtimeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  seatIds: number[];

  @IsBoolean()
  @IsNotEmpty()
  isForPay: boolean;
}
