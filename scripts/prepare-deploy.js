/**
 * JET AI - Deployment Preparation Script
 * 
 * This script prepares the project for deployment to Firebase Hosting by:
 * 1. Creating necessary build directories
 * 2. Creating Firebase deployment configuration
 * 3. Validating app settings
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.blue.bold('JET AI - Deployment Preparation\n'));
console.log(chalk.yellow('Preparing the application for Phase 5 deployment...\n'));

// Create required build directories
function createBuildDirectories() {
  console.log(chalk.cyan('Creating build directories...'));
  
  const directories = [
    'dist',
    'dist/public',
    'dist/functions'
  ];
  
  for (const dir of directories) {
    const dirPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(chalk.green(`✓ Created ${dir} directory`));
    } else {
      console.log(chalk.green(`✓ ${dir} directory already exists`));
    }
  }
  
  return true;
}

// Update Firebase configuration files
function updateFirebaseConfig() {
  console.log(chalk.cyan('Updating Firebase configuration files...'));
  
  try {
    // Update .firebaserc
    const firebaseRcPath = path.resolve(process.cwd(), '.firebaserc');
    const firebaseRcContent = {
      "projects": {
        "default": "erudite-creek-431302-q3"
      },
      "targets": {
        "erudite-creek-431302-q3": {
          "hosting": {
            "jetai": [
              "jetai"
            ]
          }
        }
      }
    };
    
    fs.writeFileSync(
      firebaseRcPath,
      JSON.stringify(firebaseRcContent, null, 2),
      'utf8'
    );
    console.log(chalk.green('✓ Updated .firebaserc'));
    
    // Update firebase.json
    const firebaseJsonPath = path.resolve(process.cwd(), 'firebase.json');
    const firebaseJsonContent = {
      "hosting": [
        {
          "target": "jetai",
          "public": "dist",
          "ignore": [
            "firebase.json",
            "**/.*",
            "**/node_modules/**"
          ],
          "rewrites": [
            {
              "source": "/api/**",
              "function": "api"
            },
            {
              "source": "**",
              "destination": "/index.html"
            }
          ],
          "headers": [
            {
              "source": "**/*.@(js|css|jpg|jpeg|gif|png|svg|webp|woff|woff2|ttf|eot)",
              "headers": [
                {
                  "key": "Cache-Control",
                  "value": "public, max-age=31536000, immutable"
                }
              ]
            },
            {
              "source": "**",
              "headers": [
                {
                  "key": "X-Frame-Options",
                  "value": "DENY"
                },
                {
                  "key": "X-Content-Type-Options",
                  "value": "nosniff"
                }
              ]
            }
          ]
        }
      ],
      "functions": {
        "source": "dist/functions",
        "predeploy": [
          "npm --prefix \"$RESOURCE_DIR\" run build"
        ]
      }
    };
    
    fs.writeFileSync(
      firebaseJsonPath,
      JSON.stringify(firebaseJsonContent, null, 2),
      'utf8'
    );
    console.log(chalk.green('✓ Updated firebase.json'));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`✖ Error updating Firebase configuration: ${error.message}`));
    return false;
  }
}

// Create deployment script
function createDeploymentScript() {
  console.log(chalk.cyan('Creating deployment script...'));
  
  const deployScriptPath = path.resolve(process.cwd(), 'scripts/deploy.sh');
  const deployScriptContent = `#!/bin/bash

# JET AI - Firebase Deployment Script
# This script deploys the JET AI application to Firebase Hosting

echo "==== JET AI - Firebase Deployment ===="
echo

# Run pre-deployment checks
echo "Running deployment checks..."
node scripts/deploy-checks.js

# Check if the checks passed
if [ $? -ne 0 ]; then
  echo "❌ Pre-deployment checks failed. Please fix the issues before deploying."
  exit 1
fi

# Build the application
echo "Building the application..."
npm run build

# Initialize Firebase
echo "Initializing Firebase..."
firebase use erudite-creek-431302-q3 || firebase use --add

# Set the hosting target
echo "Setting hosting target..."
firebase target:apply hosting jetai jetai

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting:jetai

echo
echo "✅ Deployment complete! JET AI is now live at https://jetai.socialbrands.ai"
`;
  
  fs.writeFileSync(deployScriptPath, deployScriptContent, 'utf8');
  fs.chmodSync(deployScriptPath, '755'); // Make executable
  
  console.log(chalk.green('✓ Created deployment script at scripts/deploy.sh'));
  return true;
}

// Create deployment verification script
function createVerificationScript() {
  console.log(chalk.cyan('Creating post-deployment verification script...'));
  
  const verifyScriptPath = path.resolve(process.cwd(), 'scripts/verify-deployment.js');
  const verifyScriptContent = `/**
 * JET AI - Post-Deployment Verification Script
 * 
 * This script verifies the deployed JET AI application is working correctly.
 */

import chalk from 'chalk';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.blue.bold('JET AI - Post-Deployment Verification\\n'));

async function verifyDeployment() {
  const deploymentUrl = 'https://jetai.socialbrands.ai';
  
  console.log(chalk.cyan(\`Verifying deployment at \${deploymentUrl}...\`));
  
  try {
    const response = await fetch(deploymentUrl);
    
    if (response.ok) {
      console.log(chalk.green(\`✓ Deployment is accessible at \${deploymentUrl}\`));
      
      const html = await response.text();
      
      // Check for key components in the HTML
      const checks = [
        { name: 'JET AI title', pattern: /<title>.*JET AI.*<\\/title>/ },
        { name: 'React root element', pattern: /<div id="root">/ },
        { name: 'Main JavaScript bundle', pattern: /\\.js">/ }
      ];
      
      let passed = true;
      
      for (const check of checks) {
        if (check.pattern.test(html)) {
          console.log(chalk.green(\`✓ Found \${check.name}\`));
        } else {
          console.log(chalk.red(\`✖ Could not find \${check.name}\`));
          passed = false;
        }
      }
      
      if (passed) {
        console.log(chalk.green.bold('\\n✅ Deployed application verified successfully!'));
      } else {
        console.log(chalk.yellow('\\n⚠ Deployment may have issues. Please check manually.'));
      }
    } else {
      console.log(chalk.red(\`✖ Deployment returned status code \${response.status}\`));
    }
  } catch (error) {
    console.log(chalk.red(\`✖ Error verifying deployment: \${error.message}\`));
  }
}

verifyDeployment();
`;
  
  fs.writeFileSync(verifyScriptPath, verifyScriptContent, 'utf8');
  
  console.log(chalk.green('✓ Created post-deployment verification script'));
  return true;
}

// Run all preparation tasks
async function prepareDeployment() {
  let passed = 0;
  let failed = 0;
  
  const tasks = [
    createBuildDirectories,
    updateFirebaseConfig,
    createDeploymentScript,
    createVerificationScript
  ];
  
  for (const task of tasks) {
    const result = await task();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // Add spacing between tasks
  }
  
  // Summary
  console.log(chalk.blue.bold('Preparation Summary:'));
  console.log(chalk.green(`✓ ${passed} tasks completed successfully`));
  
  if (failed > 0) {
    console.log(chalk.red(`✖ ${failed} tasks failed`));
    console.log(chalk.yellow('\nPlease fix the reported issues before proceeding.'));
    return false;
  } else {
    console.log(chalk.green.bold('\n✅ All preparation tasks completed! JET AI is ready for final validation.'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.white('  1. Run pre-deployment checks:'));
    console.log(chalk.white('     node scripts/deploy-checks.js'));
    console.log(chalk.white('  2. Deploy to Firebase:'));
    console.log(chalk.white('     scripts/deploy.sh'));
    console.log(chalk.white('  3. Verify the deployment:'));
    console.log(chalk.white('     node scripts/verify-deployment.js'));
    return true;
  }
}

// Execute the preparation tasks
prepareDeployment();