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
        example: '14:00:00',
      },
      end_time: {
        type: 'string',
        example: '16:00:00',
      },
      release_date: {
        type: 'string',
        format: 'date-time',
        example: '2025-03-05',
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
