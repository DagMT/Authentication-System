#!/bin/bash

echo "🚀 Quick Deploy to Vercel + Render"
echo "===================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Generate JWT secret
echo "🔐 Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo ""
echo "Generated JWT Secret (save this for Render):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Instructions
echo "📋 Next Steps:"
echo ""
echo "1. Deploy Backend to Render:"
echo "   → Go to https://dashboard.render.com"
echo "   → New Web Service → Connect GitHub"
echo "   → Set Dockerfile path: ./docker/Dockerfile"
echo "   → Add environment variables (use JWT secret above)"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   → Run: vercel"
echo "   → Follow prompts"
echo "   → Set VITE_API_URL to your Render backend URL"
echo ""
echo "3. Update FRONTEND_URL on Render"
echo "   → Set to your Vercel URL"
echo ""

read -p "Ready to deploy frontend to Vercel? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel
    echo ""
    echo "✅ Deployment initiated!"
    echo ""
    echo "Don't forget to:"
    echo "1. Set VITE_API_URL in Vercel dashboard"
    echo "2. Update FRONTEND_URL on Render"
else
    echo ""
    echo "Deployment cancelled. Run 'vercel' when ready."
fi
