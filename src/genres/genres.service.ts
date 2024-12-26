import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from './entities/genres.entity';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genres> {
    const genreExists = await this.genresRepository.findOne({
      where: { name: createGenreDto.name },
    });

    if (genreExists) {
      throw new HttpException('Genre already exists', 400);
    }

    const genre = new Genres();
    genre.name = createGenreDto.name;
    return this.genresRepository.save(genre);
  }

  async findAll(): Promise<Genres[]> {
    return this.genresRepository.find();
  }

  async findOne(id: number): Promise<Genres> {
    return this.genresRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genres> {
    const genre = await this.findOne(id);
    genre.name = updateGenreDto.name;
    return this.genresRepository.save(genre);
  }

  async remove(id: number): Promise<void> {
    const isExist = await this.findOne(id);

    if (!isExist) {
      throw new HttpException('Genre not found', 404);
    }

    await this.genresRepository.delete(id);
  }
}
