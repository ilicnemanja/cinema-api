import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class Movies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  rating: string;

  @Column()
  release_date: Date;

  @Column()
  duration: number;

  @Column()
  description: string;
}
