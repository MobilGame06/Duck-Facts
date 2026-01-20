# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Fixed all 8 security vulnerabilities identified by npm audit:
  - **High severity**: Fixed qs vulnerability (DoS via arrayLimit bypass) by upgrading express to 4.22.1
  - **High severity**: Fixed validator.js URL validation bypass by upgrading express-validator to 7.3.1
  - **High severity**: Fixed glob command injection vulnerability through jest dependency updates
  - **Moderate severity**: Fixed js-yaml prototype pollution vulnerability through dependency updates
  - **Moderate severity**: Fixed multiple Vite security issues by upgrading to 6.4.1

### Changed
- Updated all dependencies to their latest safe versions

#### Dependencies
- `@fontsource/inter`: 5.2.6 → 5.2.8
- `@fortawesome/fontawesome-svg-core`: 7.0.0 → 7.1.0
- `@fortawesome/free-brands-svg-icons`: 7.0.0 → 7.1.0
- `@fortawesome/free-regular-svg-icons`: 7.0.0 → 7.1.0
- `@fortawesome/free-solid-svg-icons`: 7.0.0 → 7.1.0
- `debug`: 4.4.1 → 4.4.3
- `express`: 4.21.2 → 4.22.1
- `express-validator`: 7.2.1 → 7.3.1
- `http-errors`: 2.0.0 → 2.0.1
- `nodemon`: 3.1.10 → 3.1.11

#### Dev Dependencies
- `@eslint/css`: 0.10.0 → 0.14.1
- `@eslint/js`: 9.32.0 → 9.39.2
- `@eslint/json`: 0.13.1 → 0.14.0
- `@eslint/markdown`: 7.1.0 → 7.5.1
- `concurrently`: 9.2.0 → 9.2.1
- `eslint`: 9.32.0 → 9.39.2
- `globals`: 16.3.0 → 16.5.0
- `gsap`: 3.13.0 → 3.14.2
- `jest`: 30.0.5 → 30.2.0
- `prettier`: 3.6.2 → 3.8.0
- `sass`: 1.89.2 → 1.97.2
- `supertest`: 7.1.4 → 7.2.2
- `vite`: 6.3.5 → 6.4.1

### Notes
- All 34 existing tests continue to pass
- No breaking changes or API modifications
- Build and lint processes continue to work as expected
- Security audit shows 0 vulnerabilities (down from 8)
