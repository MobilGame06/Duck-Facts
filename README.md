# Duck Facts

[Demo/Api (Could take some time to load first time)](https://duck-facts.onrender.com/)

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
