export const ApiCreateGenreBody = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Action',
      },
    },
    required: ['name'],
  },
};

export const ApiUpdateGenreBody = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Action',
      },
    },
  },
};

export const ApiGenres = {
  ApiCreateGenreBody,
  ApiUpdateGenreBody,
};
