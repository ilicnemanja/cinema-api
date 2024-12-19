import { Seats } from 'src/seats/entities/seats.entity';
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
}
