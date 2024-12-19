import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genre')
export class Genres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;
}
