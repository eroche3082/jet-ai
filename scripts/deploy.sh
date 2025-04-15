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

# 1. Asegurarse de estar en el directorio correcto
echo "Verificando directorio del proyecto..."
if [ ! -f "package.json" ]; then
  echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
  exit 1
fi

# 2. Usar el proyecto correcto en Firebase
echo "Configurando proyecto Firebase..."
firebase use erudite-creek-431302-q3 || firebase use --add

# 3. Configurar el target de hosting para JetAI
echo "Configurando target para JetAI..."
firebase target:apply hosting jetai jetai

# 4. Generar el build de producción
echo "Generando build de producción..."
npm run build

# 5. Hacer deploy exclusivamente del sitio JetAI
echo "Desplegando a Firebase Hosting..."
firebase deploy --only hosting:jetai

echo
echo "✅ Deployment complete! JET AI is now live at https://jetai.socialbrands.ai"
