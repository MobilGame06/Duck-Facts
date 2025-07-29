const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Duck-Facts API',
      version: '1.0.0',
      description: 'Facts about ducks',
    },
  },
  apis: ['./routes/api.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
