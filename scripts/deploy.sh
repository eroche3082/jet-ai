#!/bin/bash

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