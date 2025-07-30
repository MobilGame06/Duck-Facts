const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Duck-Facts API',
      version: '1.0.0',
      description:
        'A comprehensive REST API that serves interesting and educational facts about ducks in multiple languages. This project demonstrates modern API development practices and serves as a test case for AI code generation.',
      contact: {
        name: 'Duck Facts API Support',
        url: 'https://github.com/MobilGame06/Duck-Facts',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    tags: [
      {
        name: 'facts',
        description: 'Duck facts endpoints',
      },
    ],
    components: {
      schemas: {
        DuckFact: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the duck fact',
              example: 42,
            },
            fact: {
              type: 'string',
              description: 'The duck fact content',
              example:
                'Ducks have waterproof feathers thanks to an oil gland near their tails.',
            },
            lang: {
              type: 'string',
              enum: ['en', 'de'],
              description: 'Language code of the fact',
              example: 'en',
            },
          },
          required: ['id', 'fact', 'lang'],
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message describing what went wrong',
              example: 'Fact not found',
            },
          },
          required: ['error'],
        },
      },
      parameters: {
        LanguageQuery: {
          in: 'query',
          name: 'lang',
          schema: {
            type: 'string',
            enum: ['en', 'de'],
            default: 'en',
          },
          description:
            'Language code for the fact. Supported languages: English (en), German (de)',
          example: 'en',
        },
        FactId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 0,
            maximum: 170,
          },
          description: 'Unique identifier of the duck fact to retrieve (0-170)',
          example: 42,
        },
      },
      responses: {
        DuckFactResponse: {
          description: 'Successfully retrieved duck fact',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DuckFact',
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request - Invalid input parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Invalid fact ID format',
              },
            },
          },
        },
        NotFound: {
          description: 'Not found - Duck fact with specified ID does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Fact not found',
              },
            },
          },
        },
        InternalServerError: {
          description:
            'Internal server error - Something went wrong on the server',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Failed to load facts',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/api.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
