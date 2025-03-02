export const ApiCreateTicketBody = {
  schema: {
    type: 'object',
    properties: {
      showtimeId: {
        type: 'number',
        example: 123,
      },
      seatIds: {
        type: 'array',
        items: {
          type: 'number',
        },
        example: [1, 2, 3],
      },
      isForPay: {
        type: 'boolean',
        example: true,
      },
    },
    required: ['showtimeId', 'seatIds', 'isForPay'],
  },
};

export const ApiTickets = {
  ApiCreateTicketBody,
};
