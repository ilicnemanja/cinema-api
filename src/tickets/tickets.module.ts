import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets])],
})
export class TicketsModule {}
