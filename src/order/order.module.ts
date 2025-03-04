import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
