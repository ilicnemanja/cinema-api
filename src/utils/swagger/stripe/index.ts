export const ApiCreateStripePaymentBody = {
  schema: {
    type: 'object',
    properties: {
      amount: {
        type: 'number',
        example: 50,
      },
      currency: {
        type: 'string',
        example: 'usd',
      },
      metadata: {
        type: 'object',
      },
    },
    required: ['amount', 'currency', 'metadata'],
  },
};

export const ApiStripe = {
  ApiCreateStripePaymentBody,
};
