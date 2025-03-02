export const ApiCreateHallBody = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'IMAX Theater',
      },
      capacity: {
        type: 'number',
        example: 250,
      },
    },
    required: ['name', 'capacity'],
  },
};

export const ApiHalls = {
  ApiCreateHallBody,
};
