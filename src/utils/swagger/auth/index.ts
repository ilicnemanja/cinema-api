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
      captcha: {
        type: 'string',
        example: 'XXXX.DUMMY.TOKEN.XXXX',
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
      captcha: {
        type: 'string',
        example: 'captcha',
      },
    },
  },
};

export const ApiAuth = {
  ApiLoginBody,
  ApiRegisterBody,
};
