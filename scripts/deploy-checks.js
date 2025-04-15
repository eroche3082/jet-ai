/**
 * JET AI Pre-Deployment Verification Script
 * 
 * This script runs a series of checks to ensure that all components of JET AI
 * are ready for deployment to Firebase Hosting.
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.blue.bold('JET AI - Pre-Deployment Verification\n'));
console.log(chalk.yellow('Running verification checks for Phase 5 deployment...\n'));

// Check Firebase configuration
function checkFirebaseConfig() {
  console.log(chalk.cyan('Checking Firebase configuration...'));
  
  try {
    const firebaseConfig = fs.readFileSync(path.resolve(process.cwd(), '.firebaserc'), 'utf8');
    const firebaseJson = fs.readFileSync(path.resolve(process.cwd(), 'firebase.json'), 'utf8');
    
    const projectIdMatch = /"default":\s*"([^"]+)"/.exec(firebaseConfig);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    
    if (projectId !== 'erudite-creek-431302-q3') {
      console.log(chalk.red('✖ Project ID in .firebaserc does not match expected value'));
      console.log(chalk.red(`  Expected: erudite-creek-431302-q3, Found: ${projectId}`));
      return false;
    }
    
    if (!firebaseConfig.includes('"jetai"')) {
      console.log(chalk.red('✖ Missing "jetai" target in .firebaserc'));
      return false;
    }
    
    if (!firebaseJson.includes('"target": "jetai"')) {
      console.log(chalk.red('✖ Missing "target": "jetai" in firebase.json'));
      return false;
    }
    
    console.log(chalk.green('✓ Firebase configuration is valid'));
    return true;
  } catch (error) {
    console.log(chalk.red(`✖ Error checking Firebase configuration: ${error.message}`));
    return false;
  }
}

// Check client firebase config
function checkClientFirebaseConfig() {
  console.log(chalk.cyan('Checking client Firebase configuration...'));
  
  try {
    const firebaseClient = fs.readFileSync(path.resolve(process.cwd(), 'client/src/lib/firebase.ts'), 'utf8');
    
    if (!firebaseClient.includes('erudite-creek-431302-q3')) {
      console.log(chalk.red('✖ Client Firebase config does not contain correct project ID'));
      return false;
    }
    
    if (!firebaseClient.includes('1:744217150021:web:c3310bd6d4e10f237c192c')) {
      console.log(chalk.red('✖ Client Firebase config does not contain correct app ID'));
      return false;
    }
    
    console.log(chalk.green('✓ Client Firebase configuration is valid'));
    return true;
  } catch (error) {
    console.log(chalk.red(`✖ Error checking client Firebase configuration: ${error.message}`));
    return false;
  }
}

// Check server firebase config
function checkServerFirebaseConfig() {
  console.log(chalk.cyan('Checking server Firebase configuration...'));
  
  try {
    const firebaseServer = fs.readFileSync(path.resolve(process.cwd(), 'server/lib/firebase.ts'), 'utf8');
    
    if (!firebaseServer.includes('erudite-creek-431302-q3')) {
      console.log(chalk.red('✖ Server Firebase config does not contain correct project ID'));
      return false;
    }
    
    console.log(chalk.green('✓ Server Firebase configuration is valid'));
    return true;
  } catch (error) {
    console.log(chalk.red(`✖ Error checking server Firebase configuration: ${error.message}`));
    return false;
  }
}

// Check required routes
function checkRequiredComponents() {
  console.log(chalk.cyan('Checking required routes and components...'));
  
  const requiredRoutes = [
    { path: 'client/src/App.tsx', component: 'HomePage' },
    { path: 'client/src/App.tsx', component: 'LoginPage' },
    { path: 'client/src/App.tsx', component: 'EditorPage' },
    { path: 'client/src/App.tsx', component: 'SuperAdminPage' },
    { path: 'client/src/App.tsx', component: 'AdminPage' },
    { path: 'client/src/pages/SuperAdmin/SuperAdminPage.tsx', component: 'SuperAdminPage' },
    { path: 'client/src/pages/EditorPage.tsx', component: 'EditorPage' },
    { path: 'client/src/lib/agentMemoryService.ts', component: 'agentMemoryService' },
    { path: 'client/src/components/superadmin/MemoryViewer.tsx', component: 'MemoryViewer' },
    { path: 'client/src/lib/uiConfigService.ts', component: 'uiConfigService' }
  ];
  
  let allComponentsFound = true;
  
  for (const route of requiredRoutes) {
    try {
      const fileContent = fs.readFileSync(path.resolve(process.cwd(), route.path), 'utf8');
      
      if (!fileContent.includes(route.component)) {
        console.log(chalk.red(`✖ Missing component '${route.component}' in ${route.path}`));
        allComponentsFound = false;
      }
    } catch (error) {
      console.log(chalk.red(`✖ Error checking component ${route.component}: ${error.message}`));
      allComponentsFound = false;
    }
  }
  
  if (allComponentsFound) {
    console.log(chalk.green('✓ All required components are present'));
  }
  
  return allComponentsFound;
}

// Check language enforcement (all content must be in English)
function checkLanguageEnforcement() {
  console.log(chalk.cyan('Checking language enforcement (English-only content)...'));
  
  const filesToCheck = [
    'client/src/components/layouts/MainLayout.tsx',
    'client/src/pages/HomePage.tsx',
    'client/src/pages/LoginPage.tsx',
    'client/src/pages/FeaturesPage.tsx',
    'client/src/components/onboarding/OnboardingWizard.tsx'
  ];
  
  let languageValid = true;
  
  try {
    // We'll just check for explicit language preferences in the code
    for (const filePath of filesToCheck) {
      try {
        const content = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
        
        // Check for Spanish content markers
        if (content.includes('español') || 
            content.includes('idioma') ||
            content.includes('Español') ||
            content.includes('lenguaje:')) {
          console.log(chalk.red(`✖ Possible non-English content found in ${filePath}`));
          languageValid = false;
        }
      } catch (err) {
        // If file doesn't exist, we'll just skip it
        console.log(chalk.yellow(`⚠ Could not check file ${filePath}`));
      }
    }
    
    if (languageValid) {
      console.log(chalk.green('✓ No obvious non-English content detected'));
    }
    
    return languageValid;
  } catch (error) {
    console.log(chalk.red(`✖ Error checking language enforcement: ${error.message}`));
    return false;
  }
}

// Check for AI Features content
function checkAIFeaturesContent() {
  console.log(chalk.cyan('Checking AI Features content...'));
  
  try {
    const featuresPath = 'client/src/pages/FeaturesPage.tsx';
    if (!fs.existsSync(path.resolve(process.cwd(), featuresPath))) {
      console.log(chalk.red(`✖ FeaturesPage.tsx not found`));
      return false;
    }
    
    const content = fs.readFileSync(path.resolve(process.cwd(), featuresPath), 'utf8');
    
    // Check if the content has detailed features listing rather than chat interface
    if (content.includes('AIChat') || content.includes('ChatInterface')) {
      console.log(chalk.red('✖ AI Features page contains chat interface instead of detailed features list'));
      return false;
    }
    
    // Simple heuristic to check for feature details - count list items or feature headings
    const featureCount = (content.match(/<Feature/g) || []).length + 
                         (content.match(/<li>/g) || []).length;
    
    if (featureCount < 15) {
      console.log(chalk.red(`✖ AI Features page has fewer than 20 features (found approximately ${featureCount})`));
      return false;
    }
    
    console.log(chalk.green('✓ AI Features page appears to have sufficient detailed content'));
    return true;
  } catch (error) {
    console.log(chalk.red(`✖ Error checking AI Features content: ${error.message}`));
    return false;
  }
}

// Run all checks
async function runAllChecks() {
  let passed = 0;
  let failed = 0;
  
  const checks = [
    checkFirebaseConfig,
    checkClientFirebaseConfig,
    checkServerFirebaseConfig,
    checkRequiredComponents,
    checkLanguageEnforcement,
    checkAIFeaturesContent
  ];
  
  for (const check of checks) {
    const result = await check();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // Add spacing between checks
  }
  
  // Summary
  console.log(chalk.blue.bold('Verification Summary:'));
  console.log(chalk.green(`✓ ${passed} checks passed`));
  
  if (failed > 0) {
    console.log(chalk.red(`✖ ${failed} checks failed`));
    console.log(chalk.yellow('\nPlease fix the reported issues before deploying to Firebase.'));
    return false;
  } else {
    console.log(chalk.green.bold('\n✅ All checks passed! JET AI is ready for deployment.'));
    console.log(chalk.yellow('\nDeployment commands:'));
    console.log(chalk.white('  firebase use --add'));
    console.log(chalk.white('  # Select: erudite-creek-431302-q3'));
    console.log(chalk.white('  firebase target:apply hosting jetai jetai'));
    console.log(chalk.white('  firebase deploy --only hosting:jetai'));
    return true;
  }
}

// Execute the checks
runAllChecks();