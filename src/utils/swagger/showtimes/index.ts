export const ApiCreateShowtimeBody = {
  schema: {
    type: 'object',
    properties: {
      movie_id: {
        type: 'string',
        example: '5f8d0d55b54764421b7156d6',
      },
      hall_id: {
        type: 'number',
        example: 1,
      },
      start_time: {
        type: 'string',
        example: '2025-03-05T14:00:00Z',
      },
      end_time: {
        type: 'string',
        example: '2025-03-05T16:00:00Z',
      },
      release_date: {
        type: 'string',
        format: 'date-time',
        example: '2025-03-05T00:00:00Z',
      },
      isActive: {
        type: 'boolean',
        example: true,
      },
    },
    required: [
      'movie_id',
      'hall_id',
      'start_time',
      'end_time',
      'release_date',
      'isActive',
    ],
  },
};

export const ApiShowtimes = {
  ApiCreateShowtimeBody,
};
