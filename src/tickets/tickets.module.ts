import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';
import { SeatsModule } from 'src/seats/seats.module';
import { StripeService } from 'src/stripe/stripe.service';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets]), ShowtimesModule, SeatsModule],
  controllers: [TicketsController],
  providers: [TicketsService, StripeService, OrderService],
  exports: [TicketsService],
})
export class TicketsModule {}
