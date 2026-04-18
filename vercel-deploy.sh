#!/bin/bash

# Vercel Deployment Helper Script
# This script runs migrations and seeding after Vercel deployment

set -e

echo "🚀 Starting Vercel Deployment Setup..."

# Check if running on Vercel
if [ "$VERCEL" = "1" ]; then
  echo "✅ Running on Vercel environment"
  
  # Generate Prisma client
  echo "📦 Generating Prisma client..."
  npx prisma generate
  
  # Apply database migrations
  echo "🔄 Applying database migrations..."
  npx prisma db push --skip-generate
  
  # Run seed (optional - uncomment if needed)
  # echo "🌱 Seeding database..."
  # npx prisma db seed
  
  echo "✅ Deployment setup completed!"
else
  echo "⚠️  Not running on Vercel. For local setup, run:"
  echo "   npm run db:push"
  echo "   npm run seed"
fi
