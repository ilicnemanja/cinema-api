import { Hall } from 'src/halls/entities/hall.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('seats')
export class Seats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row_number: number;

  @Column()
  number: number;

  @ManyToOne(() => Hall, (hall) => hall.seats, { onDelete: 'CASCADE' })
  hall: Hall;
}
