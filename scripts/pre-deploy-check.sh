#!/bin/bash

echo "🔒 Pre-Deployment Security Check"
echo "=================================="
echo ""

ERRORS=0

# Check 1: .env should not be committed
echo "✓ Checking .env is not tracked..."
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "❌ ERROR: .env is tracked in git!"
    ERRORS=$((ERRORS + 1))
else
    echo "✓ .env is not tracked"
fi

# Check 2: No hardcoded credentials in Go files
echo ""
echo "✓ Checking for hardcoded credentials..."
if grep -r "npg_\|AaEb\|tpzk" --include="*.go" . 2>/dev/null | grep -v ".git"; then
    echo "❌ ERROR: Found hardcoded credentials in Go files!"
    ERRORS=$((ERRORS + 1))
else
    echo "✓ No hardcoded credentials found"
fi

# Check 3: JWT_SECRET validation
echo ""
echo "✓ Checking JWT_SECRET in .env.render..."
if grep -q "CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET" .env.render 2>/dev/null; then
    echo "✓ .env.render is a template (good)"
else
    echo "⚠️  WARNING: .env.render might contain real secrets"
fi

# Check 4: Check render.yaml doesn't have secrets
echo ""
echo "✓ Checking render.yaml..."
if grep -E "npg_|AaEb|tpzk|flack74621" render.yaml 2>/dev/null; then
    echo "❌ ERROR: render.yaml contains hardcoded secrets!"
    ERRORS=$((ERRORS + 1))
else
    echo "✓ render.yaml is clean"
fi

# Check 5: Verify .gitignore
echo ""
echo "✓ Checking .gitignore..."
if grep -q "^\.env$" .gitignore; then
    echo "✓ .env is in .gitignore"
else
    echo "❌ ERROR: .env not in .gitignore!"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Documentation files are ignored
echo ""
echo "✓ Checking documentation is ignored..."
if grep -q "^documentation" .gitignore; then
    echo "✓ documentation/ is gitignored"
else
    echo "⚠️  WARNING: documentation/ not in .gitignore"
fi

# Summary
echo ""
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All security checks passed!"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables on Render"
    echo "2. Use: openssl rand -base64 32 for JWT_SECRET"
    echo "3. Deploy backend"
    echo "4. Run migrations"
    echo "5. Deploy frontend"
    exit 0
else
    echo "❌ Found $ERRORS security issue(s)!"
    echo ""
    echo "Fix these issues before deploying to production."
    exit 1
fi
