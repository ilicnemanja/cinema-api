import { Genres } from 'src/genres/entities/genres.entity';
import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

@Entity('movie')
export class Movies {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  rating: string;

  @Column()
  release_date: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  duration: number;

  @Column()
  description: string;

  @ManyToMany(() => Genres, (genre) => genre.movies, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'movie_genre',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genres[];
}
