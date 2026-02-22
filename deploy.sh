#!/bin/bash

# MergeGuard Deploy Script

echo "🚀 Deploying MergeGuard to Vercel..."

# Build
npm run build

# Deploy
vercel --prod --yes

echo "✅ Done! Check your Vercel dashboard for the URL."
