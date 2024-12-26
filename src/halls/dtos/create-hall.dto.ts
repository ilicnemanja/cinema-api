import { IsNumber, IsString } from 'class-validator';

export class CreateHallDto {
  @IsString()
  name: string;
  @IsNumber()
  capacity;
}
