import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Repository } from 'typeorm';
import { CreateHallDto } from './dtos/create-hall.dto';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private hallsRepositry: Repository<Hall>,
  ) {}

  create(createHallDto: CreateHallDto) {
    const hall = this.hallsRepositry.create(createHallDto);
    return this.hallsRepositry.save(hall);
  }

  async findOne(hallId: number) {
    return await this.hallsRepositry.findOne({
      where: { id: hallId },
    });
  }

  async delete(hallId: number) {
    const isExist = await this.findOne(hallId);
    if (!isExist) {
      throw new HttpException('Hall not found', 404);
    }

    await this.hallsRepositry.delete(hallId);
  }
}
