import { Movies } from 'src/movies/entities/movies.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('genre')
export class Genres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => Movies, (movie) => movie.genres)
  movies: Movies[];
}
