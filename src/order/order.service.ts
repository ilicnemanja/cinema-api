import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from 'src/tickets/entities/tickets.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
  ) {}

  async releaseTicketsAfterPayment(ticketIds: number[]) {
    if (!ticketIds.length) return;

    await this.ticketRepository.update(
      { id: In(ticketIds) },
      { status: 'SOLD' },
    );

    return {
      status: 'success',
      message: 'Tickets released',
      data: ticketIds,
    };
  }

  async sendEmailAfterPayment(userId: string, ticketIds: number[]) {
    console.log('Sending email to user with id:', userId);
    console.log('Ticket ids:', ticketIds);
    // TODO: Implement this method
    throw new Error('Method not implemented');
  }
}
