import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  rating: string;

  @IsString()
  release_date: Date;

  @IsNumber()
  duration: number;

  @IsString()
  description: string;

  @IsString({ each: true })
  genres: string[];
}
