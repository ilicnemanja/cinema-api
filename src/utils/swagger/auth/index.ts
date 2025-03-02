const ApiLoginBody = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'johndoe@example.com',
      },
      password: {
        type: 'string',
        example: 'password',
      },
    },
  },
};

const ApiRegisterBody = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'johndoe@example.com',
      },
      password: {
        type: 'string',
        example: 'password',
      },
      name: {
        type: 'string',
        example: 'John Doe',
      },
    },
  },
};

export const ApiAuth = {
  ApiLoginBody,
  ApiRegisterBody,
};
