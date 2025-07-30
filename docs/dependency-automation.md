# Automated Dependency Updates with GitHub Copilot

This repository includes an automated dependency management system that leverages GitHub Copilot to keep dependencies up-to-date while ensuring code compatibility.

## Overview

The system consists of two complementary workflows:

1. **Standard Dependency Updates** (`dependency-updates.yml`) - Runs weekly on Mondays
2. **Copilot-Enhanced Updates** (`copilot-enhanced-updates.yml`) - Runs weekly on Wednesdays with intelligent analysis

## Features

### 🔍 Automated Dependency Scanning
- Regular scanning for outdated npm dependencies
- Security vulnerability detection
- Categorized dependency analysis (core framework, dev tools, middleware, etc.)

### 🤖 Intelligent Update Strategies
The system applies different update strategies based on the complexity of changes:

- **Conservative**: Only patch and minor updates for potential breaking changes
- **Selective**: Updates most dependencies but handles major framework changes carefully  
- **Standard**: Standard updates for minor changes with low risk

### 🧪 Comprehensive Testing
- Runs complete test suite after updates
- Validates code formatting and linting
- Confirms server startup compatibility
- Integration test verification

### 📋 Automated Pull Requests
- Creates detailed PRs with change summaries
- Links to relevant changelogs when available
- Includes security impact analysis
- Provides code adaptation recommendations

## Usage

### Manual Dependency Checking
```bash
# Check for outdated dependencies
npm run deps:check

# Update dependencies manually
npm run deps:update
```

### Workflow Triggers

#### Automatic (Scheduled)
- **Standard Updates**: Every Monday at 9 AM UTC
- **Enhanced Updates**: Every Wednesday at 10 AM UTC

#### Manual Trigger
You can manually trigger either workflow from the GitHub Actions tab:
1. Go to Actions → Select workflow
2. Click "Run workflow"
3. For enhanced updates, optionally force updates even with minor changes

## Update Strategy Logic

The system analyzes dependency changes and categorizes them:

### Breaking Changes Detection
Identifies potential breaking changes in critical packages:
- Express.js framework updates
- EJS template engine changes
- ESLint rule modifications
- Jest testing framework updates

### Version Analysis
- **Major updates** (e.g., 4.x → 5.x): Triggers conservative or selective strategy
- **Minor updates** (e.g., 4.1 → 4.2): Uses standard strategy
- **Patch updates** (e.g., 4.1.1 → 4.1.2): Always safe to apply

## Code Adaptation Analysis

The enhanced workflow provides intelligent analysis for potential code changes:

### Express.js Updates
- Middleware compatibility checks
- Route handler signature verification
- Error handling pattern review

### EJS Template Updates
- Template rendering validation
- Deprecated feature detection
- Data binding compatibility

### ESLint Configuration
- Rule configuration updates
- Deprecated rule identification
- Code style compatibility

### Jest Testing Framework
- Test configuration updates
- API change detection
- Mock and assertion compatibility

## Security Integration

- **Vulnerability Scanning**: Automatic detection of security issues
- **Audit Integration**: npm audit results included in analysis
- **Security Impact**: Documented in pull request descriptions

## Customization

### Modifying Update Frequency
Edit the cron expressions in the workflow files:
```yaml
schedule:
  # Weekly on Monday at 9 AM UTC
  - cron: '0 9 * * 1'
```

### Adjusting Update Strategies
Modify the strategy logic in `copilot-enhanced-updates.yml`:
```yaml
# Add or remove packages from selective updates
ncu -u --reject express,ejs,eslint,jest
```

### Adding Custom Dependency Categories
Update the categories in `scripts/dependency-check.js`:
```javascript
const categories = {
  'Custom Category': ['package1', 'package2'],
  // ... existing categories
};
```

## Monitoring and Maintenance

### Review Process
1. Automated PRs are created with detailed analysis
2. Repository owner is automatically assigned as reviewer
3. All tests must pass before merging
4. Manual review recommended for major updates

### Failure Handling
- Failed updates create issues for manual investigation
- Test failures prevent PR creation
- Security vulnerabilities are flagged prominently

### Best Practices
- Review changelog links in automated PRs
- Test functionality manually for major updates
- Monitor application performance after updates
- Keep custom configurations in sync with dependency changes

## Files and Components

### Workflows
- `.github/workflows/dependency-updates.yml` - Standard update workflow
- `.github/workflows/copilot-enhanced-updates.yml` - Enhanced analysis workflow

### Scripts
- `scripts/dependency-check.js` - Dependency analysis utility

### Configuration
- `package.json` - Added dependency management scripts
- Enhanced with `deps:check` and `deps:update` commands

## Troubleshooting

### Common Issues

#### Workflow Permissions
Ensure the repository has the following permissions enabled:
- Actions: Read
- Contents: Write
- Pull Requests: Write

#### Node.js Version
The workflows use Node.js 18. If compatibility issues arise:
1. Update the node-version in workflow files
2. Test locally with the same version
3. Update any version-specific configurations

#### Dependency Conflicts
If updates create conflicts:
1. Check the PR description for specific issues
2. Review the workflow logs for detailed error messages
3. Consider manual resolution for complex scenarios

### Getting Help
- Check workflow run logs in the Actions tab
- Review PR descriptions for detailed analysis
- Use `npm run deps:check` for local debugging
- Examine `dependency-report.txt` for detailed analysis

---

This automated system ensures your Duck Facts application stays secure, up-to-date, and compatible with the latest dependency versions while minimizing manual maintenance overhead.