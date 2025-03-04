import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket')
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showtime_id: number;

  @Column()
  seat_id: number;

  @Column()
  user_id: string;

  @Column({
    type: 'enum',
    enum: ['RESERVED', 'SOLD', 'PENDING_PAYMENT'],
    default: 'RESERVED',
  })
  status: string;
}
