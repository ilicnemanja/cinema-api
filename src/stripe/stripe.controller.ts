import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import configuration from 'src/utils/config';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ApiStripe } from 'src/utils/swagger/stripe';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiBearerAuth()
  @ApiBody(ApiStripe.ApiCreateStripePaymentBody)
  @Post('create')
  async createPayment(@Body() body) {
    const { amount, currency, metadata } = body;
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      metadata,
    );
    return { clientSecret: paymentIntent.client_secret };
  }

  @ApiExcludeEndpoint()
  @Post('webhook')
  async handleWebhook(@Req() request: Request, @Res() response: Response) {
    const sig = request.headers['stripe-signature'];
    const endpointSecret = configuration.stripe.webhookSecret;

    try {
      const event = request.body;

      if (sig) {
        const stripe = new Stripe(configuration.stripe.secretKey, {
          apiVersion: '2025-02-24.acacia',
        });
        stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      }

      // Handle payment success
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        const ticketIds = JSON.parse(paymentIntent.metadata.tickets || '[]');

        await this.stripeService.completePayment(userId, ticketIds);
      }

      response.sendStatus(200);
    } catch (err) {
      console.error(err);
      response.status(400).send(`Webhook error: ${err.message}`);
    }
  }
}
