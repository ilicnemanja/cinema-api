export const ApiBodyForLockSeats = {
  schema: {
    type: 'object',
    properties: {
      showtimeId: {
        type: 'number',
        example: 123,
      },
      movieId: {
        type: 'string',
        example: '5f8d0d55b54764421b7156d6',
      },
      seatRow: {
        type: 'number',
        example: 5,
      },
      seatNumber: {
        type: 'number',
        example: 12,
      },
    },
    required: ['showtimeId', 'movieId', 'seatRow', 'seatNumber'],
  },
};

export const ApiBodyForUnlockSeats = {
  schema: {
    type: 'object',
    properties: {
      movieId: {
        type: 'string',
        example: '5f8d0d55b54764421b7156d6',
      },
      seatRow: {
        type: 'number',
        example: 5,
      },
      seatNumber: {
        type: 'number',
        example: 12,
      },
    },
    required: ['movieId', 'seatRow', 'seatNumber'],
  },
};

export const ApiCreateSeatsListBody = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        row_number: {
          type: 'number',
          example: 5,
        },
        number: {
          type: 'number',
          example: 12,
        },
        hall_id: {
          type: 'number',
          example: 1,
        },
      },
      required: ['row_number', 'number', 'hall_id'],
    },
  },
};

export const ApiSeats = {
  ApiBodyForLockSeats,
  ApiBodyForUnlockSeats,
  ApiCreateSeatsListBody,
};
