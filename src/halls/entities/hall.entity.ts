import { Seats } from 'src/seats/entities/seats.entity';
import { Showtimes } from 'src/showtimes/entities/showtimes.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('hall')
export class Hall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => Seats, (seat) => seat.hall)
  seats: Seats[];

  @OneToMany(() => Showtimes, (showtime) => showtime.hall)
  showtimes: Showtimes[];
}
