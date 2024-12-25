import { Hall } from 'src/halls/entities/hall.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('showtime')
export class Showtimes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  release_date: Date;

  @Column({ default: false })
  IsActive: boolean;

  @ManyToOne(() => Movies, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movies;

  @ManyToOne(() => Hall, (hall) => hall.showtimes)
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;
}
