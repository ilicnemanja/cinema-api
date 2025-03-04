import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import configuration from 'src/utils/config';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly orderService: OrderService) {
    this.stripe = new Stripe(configuration.stripe.secretKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string, metadata: any) {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
      });
    } catch (error) {
      throw new Error(`Failed to create Payment Intent: ${error.message}`);
    }
  }

  async cancelPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to cancel Payment Intent: ${error.message}`);
    }
  }

  async completePayment(userId: string, ticketIds: number[]) {
    try {
      // Release tickets
      const releasedTicketsResponse =
        await this.orderService.releaseTicketsAfterPayment(ticketIds);

      if (releasedTicketsResponse.status !== 'success') {
        throw new Error(`Failed to release tickets after payment`);
      }

      // Send email
      await this.orderService.sendEmailAfterPayment(userId, ticketIds);
    } catch (error) {
      throw new Error(`Failed to complete payment order: ${error.message}`);
    }
  }
}
