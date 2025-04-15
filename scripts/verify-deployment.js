/**
 * JET AI - Post-Deployment Verification Script
 * 
 * This script verifies the deployed JET AI application is working correctly.
 */

const chalk = require('chalk');
const fetch = require('node-fetch');

console.log(chalk.blue.bold('JET AI - Post-Deployment Verification\n'));

async function verifyDeployment() {
  const deploymentUrl = 'https://jetai.socialbrands.ai';
  
  console.log(chalk.cyan(`Verifying deployment at ${deploymentUrl}...`));
  
  try {
    const response = await fetch(deploymentUrl);
    
    if (response.ok) {
      console.log(chalk.green(`✓ Deployment is accessible at ${deploymentUrl}`));
      
      const html = await response.text();
      
      // Check for key components in the HTML
      const checks = [
        { name: 'JET AI title', pattern: /<title>.*JET AI.*<\/title>/ },
        { name: 'React root element', pattern: /<div id="root">/ },
        { name: 'Main JavaScript bundle', pattern: /\.js">/ }
      ];
      
      let passed = true;
      
      for (const check of checks) {
        if (check.pattern.test(html)) {
          console.log(chalk.green(`✓ Found ${check.name}`));
        } else {
          console.log(chalk.red(`✖ Could not find ${check.name}`));
          passed = false;
        }
      }
      
      if (passed) {
        console.log(chalk.green.bold('\n✅ Deployed application verified successfully!'));
      } else {
        console.log(chalk.yellow('\n⚠ Deployment may have issues. Please check manually.'));
      }
    } else {
      console.log(chalk.red(`✖ Deployment returned status code ${response.status}`));
    }
  } catch (error) {
    console.log(chalk.red(`✖ Error verifying deployment: ${error.message}`));
  }
}

verifyDeployment();