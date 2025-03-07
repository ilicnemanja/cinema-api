import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({
    type: 'enum',
    enum: ['CUSTOMER', 'ADMIN'],
    default: 'CUSTOMER',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['CREDENTIALS', 'GOOGLE'],
    default: 'CREDENTIALS',
  })
  provider: string;
}
