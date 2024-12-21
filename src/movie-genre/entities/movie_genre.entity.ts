import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie_genre')
export class MovieGenre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movie_id: string;

  @Column()
  genre_id: number;
}
