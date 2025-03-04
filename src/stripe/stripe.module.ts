import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderService } from 'src/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets])],
  controllers: [StripeController],
  providers: [StripeService, OrderService],
  exports: [StripeService],
})
export class StripeModule {}
