import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall])],
})
export class HallsModule {}
