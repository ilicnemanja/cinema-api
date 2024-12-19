import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('showtime')
export class Showtimes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movie_id: number;

  @Column()
  hall_id: number;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  release_date: Date;

  @Column({ default: false })
  IsActive: boolean;
}
