import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsString()
  movie_id: string;

  @IsNumber()
  hall_id: number;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsString()
  release_date: Date;

  @IsBoolean()
  IsActive: boolean;
}
