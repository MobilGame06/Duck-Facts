#!/usr/bin/env node

/**
 * Dependency Update Helper Script
 * 
 * This script helps identify and analyze dependency updates,
 * providing additional context for automated workflows.
 */

const fs = require('fs');
const { execSync } = require('child_process');

function checkDependencyUpdates() {
  console.log('🔍 Checking for dependency updates...\n');
  
  try {
    // Check for outdated packages
    const outdatedOutput = execSync('npm outdated --json', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'] // Suppress stderr
    });
    
    const outdated = JSON.parse(outdatedOutput || '{}');
    
    if (Object.keys(outdated).length === 0) {
      console.log('✅ All dependencies are up to date!');
      return false;
    }
    
    console.log('📦 Outdated dependencies found:\n');
    
    Object.entries(outdated).forEach(([pkg, info]) => {
      console.log(`  ${pkg}:`);
      console.log(`    Current: ${info.current}`);
      console.log(`    Wanted:  ${info.wanted}`);
      console.log(`    Latest:  ${info.latest}`);
      console.log('');
    });
    
    return true;
    
  } catch (error) {
    // npm outdated returns exit code 1 when updates are available
    if (error.status === 1 && error.stdout) {
      const outdated = JSON.parse(error.stdout || '{}');
      
      if (Object.keys(outdated).length > 0) {
        console.log('📦 Outdated dependencies found:\n');
        
        Object.entries(outdated).forEach(([pkg, info]) => {
          console.log(`  ${pkg}:`);
          console.log(`    Current: ${info.current}`);
          console.log(`    Wanted:  ${info.wanted}`);
          console.log(`    Latest:  ${info.latest}`);
          console.log('');
        });
        
        return true;
      }
    }
    
    console.log('✅ All dependencies are up to date!');
    return false;
  }
}

function checkSecurityVulnerabilities() {
  console.log('🔐 Checking for security vulnerabilities...\n');
  
  try {
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditOutput);
    
    if (audit.metadata.vulnerabilities.total === 0) {
      console.log('✅ No security vulnerabilities found!');
      return false;
    }
    
    console.log(`⚠️  Found ${audit.metadata.vulnerabilities.total} vulnerabilities:`);
    console.log(`   High: ${audit.metadata.vulnerabilities.high}`);
    console.log(`   Moderate: ${audit.metadata.vulnerabilities.moderate}`);
    console.log(`   Low: ${audit.metadata.vulnerabilities.low}`);
    console.log('');
    
    return true;
    
  } catch (error) {
    console.log('❌ Error checking vulnerabilities:', error.message);
    return false;
  }
}

function generateUpdatePlan() {
  console.log('📋 Generating update plan...\n');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('Current dependency overview:');
  console.log(`  Total dependencies: ${Object.keys(dependencies).length}`);
  console.log(`  Production dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`  Development dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  console.log('');
  
  // Categorize dependencies
  const categories = {
    'Core Framework': ['express', 'ejs'],
    'Development Tools': ['eslint', 'prettier', 'jest', 'nodemon'],
    'Middleware': ['cookie-parser', 'morgan', 'express-validator'],
    'Documentation': ['swagger-jsdoc', 'swagger-ui-express'],
    'Testing': ['supertest', 'jest'],
    'Utilities': ['debug', 'http-errors']
  };
  
  Object.entries(categories).forEach(([category, packages]) => {
    const found = packages.filter(pkg => dependencies[pkg]);
    if (found.length > 0) {
      console.log(`${category}:`);
      found.forEach(pkg => {
        console.log(`  - ${pkg}: ${dependencies[pkg]}`);
      });
      console.log('');
    }
  });
}

// Main execution
if (require.main === module) {
  console.log('🤖 Duck Facts - Dependency Update Helper\n');
  
  try {
    const hasUpdates = checkDependencyUpdates();
    const hasVulnerabilities = checkSecurityVulnerabilities();
    
    console.log('='.repeat(50));
    generateUpdatePlan();
    
    if (hasUpdates || hasVulnerabilities) {
      console.log('🔧 Recommendations:');
      if (hasUpdates) {
        console.log('  - Run automated dependency update workflow');
        console.log('  - Review and test updated dependencies');
      }
      if (hasVulnerabilities) {
        console.log('  - Run "npm audit fix" to address vulnerabilities');
        console.log('  - Review security advisories for affected packages');
      }
    } else {
      console.log('🎉 Project dependencies are in excellent condition!');
    }
    
  } catch (error) {
    console.error('❌ Error running dependency check:', error.message);
    process.exit(1);
  }
}

module.exports = {
  checkDependencyUpdates,
  checkSecurityVulnerabilities,
  generateUpdatePlan
};