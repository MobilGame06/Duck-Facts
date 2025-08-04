# Duck Facts API

A simple REST API that serves interesting facts about ducks in multiple languages. This project is primarily a test for AI code generation and demonstrates modern Node.js API development practices.

🦆 **[Live Demo/API](https://duck.mobilserver.xyz/)**

## About This Project

This project serves as a test case for AI code generation, showcasing how AI can create a fully functional REST API with comprehensive testing, documentation, and modern development practices. It demonstrates proper API design, error handling, internationalization, and documentation standards.

## Features

- 🌐 Multi-language support (English and German)
- 📚 RESTful API with comprehensive endpoints
- 📖 Interactive Swagger/OpenAPI documentation
- 🧪 Comprehensive test suite with >95% coverage
- 🚀 Production-ready deployment configuration
- 🔍 Input validation and error handling
- 💻 Modern Node.js/Express.js architecture

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MobilGame06/Duck-Facts.git
   cd Duck-Facts
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

4. **Or start in production mode:**
   ```bash
   npm start
   ```

## API Endpoints

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://duck.mobilserver.xyz//api`

### Available Endpoints

#### Get Random Duck Fact

```http
GET /api/facts/random
```

**Query Parameters:**

- `lang` (optional): Language code (`en` for English, `de` for German). Defaults to `en`.

**Example Request:**

```bash
curl "http://localhost:3000/api/facts/random?lang=en"
```

**Example Response:**

```json
{
  "id": 42,
  "fact": "Ducks have waterproof feathers thanks to an oil gland near their tails.",
  "lang": "en"
}
```

#### Get Specific Duck Fact by ID

```http
GET /api/facts/{id}
```

**Path Parameters:**

- `id` (required): Integer ID of the fact (0-170)

**Query Parameters:**

- `lang` (optional): Language code (`en` for English, `de` for German). Defaults to `en`.

**Example Request:**

```bash
curl "http://localhost:3000/api/facts/0?lang=de"
```

**Example Response:**

```json
{
  "id": 0,
  "fact": "Enten haben wasserdichte Federn dank einer Öldrüse in der Nähe ihrer Schwänze.",
  "lang": "de"
}
```

### Error Responses

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Fact ID not found or out of range
- `500 Internal Server Error`: Server-side errors

**Example Error Response:**

```json
{
  "error": "Fact not found"
}
```

## Documentation

### Interactive API Documentation

Visit `/api-docs` when the server is running to access the interactive Swagger UI documentation:

- Development: `http://localhost:3000/api-docs`
- Production: `https://duck.mobilserver.xyz/api-docs`

## Testing

This project includes comprehensive unit and integration tests using Jest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests** (`__tests__/unit/`): Test individual functions and utilities
- **Integration Tests** (`__tests__/integration/`): Test API endpoints and their behavior
- **Coverage**: Maintains >95% code coverage across all modules

### Test Features

- API endpoint testing with various scenarios (valid/invalid inputs, edge cases)
- Error handling verification
- Boundary condition testing
- File I/O mocking for reliable tests
- Comprehensive validation of response formats

## Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Project Structure

```
Duck-Facts/
├── __tests__/           # Test files
│   ├── integration/     # API integration tests
│   └── unit/           # Unit tests
├── bin/                # Server startup script
├── data/               # JSON data files
├── middleware/         # Express middleware
├── public/             # Static assets
├── routes/             # API route definitions
├── utils/              # Utility functions
├── views/              # EJS templates
└── app.js              # Main application file
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

### Contribution Guidelines

- **Code Style**: Follow the existing code style. Use ESLint and Prettier.
- **Testing**: Add tests for new features. Maintain >95% test coverage.
- **Documentation**: Update documentation for any API changes.
- **Commits**: Use clear, descriptive commit messages.
- **Pull Requests**: Provide a clear description of changes and their purpose.

### Adding New Facts

To add new duck facts:

1. Edit `data/facts.json`
2. Add facts to both `en` and `de` arrays
3. Ensure facts are family-friendly and educational
4. Run tests to verify the changes work correctly

### Reporting Issues

Please use the GitHub issue tracker to report bugs or request features. When reporting bugs, include:

- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages (if any)

## Deployment

The project is configured for deployment on various platforms:

### Vercel (Recommended)

The project includes a `vercel.json` configuration file for seamless Vercel deployment.

### Manual Deployment

1. Set the `PORT` environment variable if needed
2. Run `npm start` to start the production server

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Duck facts compiled from various educational sources
- Built with Node.js, Express.js, and modern web technologies
- Created as a demonstration of AI-assisted code generation

#### Bitte seien sie Stolz auf mich
