export const ApiCreateMovieBody = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Inception',
      },
      image: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/inception.jpg',
      },
      rating: {
        type: 'string',
        nullable: true,
        example: 'PG-13',
      },
      release_date: {
        type: 'string',
        format: 'date-time',
        example: '2010-07-16T00:00:00Z',
      },
      duration: {
        type: 'number',
        example: 148,
      },
      description: {
        type: 'string',
        example:
          'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
      },
      genres: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Action', 'Sci-Fi', 'Thriller'],
      },
    },
    required: ['title', 'release_date', 'duration', 'description', 'genres'],
  },
};

export const ApiUpdateMovieBody = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Inception',
      },
      image: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/inception.jpg',
      },
      rating: {
        type: 'string',
        nullable: true,
        example: 'PG-13',
      },
      release_date: {
        type: 'string',
        format: 'date-time',
        example: '2010-07-16T00:00:00Z',
      },
      duration: {
        type: 'number',
        example: 148,
      },
      description: {
        type: 'string',
        example:
          'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
      },
      genres: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Action', 'Sci-Fi', 'Thriller'],
      },
    },
  },
};

export const ApiMovies = {
  ApiCreateMovieBody,
  ApiUpdateMovieBody,
};
