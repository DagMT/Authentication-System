#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Go Authentication System - Setup Verification${NC}"
echo -e "${BLUE}=================================================${NC}\n"

ERRORS=0

# Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker installed${NC}"
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker daemon running${NC}"
    else
        echo -e "${RED}❌ Docker daemon not running${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Docker not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Docker Compose
echo -e "${YELLOW}Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${RED}❌ Docker Compose not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Go
echo -e "${YELLOW}Checking Go...${NC}"
if command -v go &> /dev/null; then
    GO_VERSION=$(go version | awk '{print $3}')
    echo -e "${GREEN}✅ Go installed ($GO_VERSION)${NC}"
else
    echo -e "${YELLOW}⚠️  Go not installed (optional for Docker setup)${NC}"
fi
echo ""

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed ($NODE_VERSION)${NC}"
else
    echo -e "${RED}❌ Node.js not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed ($NPM_VERSION)${NC}"
else
    echo -e "${RED}❌ npm not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check backend .env
echo -e "${YELLOW}Checking backend configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
    
    # Check critical variables
    if grep -q "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" .env; then
        echo -e "${YELLOW}⚠️  JWT_SECRET is still default (change for production)${NC}"
    else
        echo -e "${GREEN}✅ JWT_SECRET is customized${NC}"
    fi
    
    if grep -q "SMTP_USER=" .env && grep -q "SMTP_PASS=" .env; then
        echo -e "${GREEN}✅ SMTP credentials configured${NC}"
    else
        echo -e "${YELLOW}⚠️  SMTP credentials not configured (emails won't send)${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env file missing${NC}"
    echo -e "${YELLOW}   Run: cp .env.example .env${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check frontend .env
echo -e "${YELLOW}Checking frontend configuration...${NC}"
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ Frontend .env file exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env file missing (will use defaults)${NC}"
    echo -e "${YELLOW}   Create frontend/.env with: VITE_API_URL=http://localhost:8080${NC}"
fi
echo ""

# Check frontend dependencies
echo -e "${YELLOW}Checking frontend dependencies...${NC}"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo -e "${YELLOW}   Run: cd frontend && npm install${NC}"
fi
echo ""

# Check ports
echo -e "${YELLOW}Checking port availability...${NC}"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8080 is in use (backend port)${NC}"
else
    echo -e "${GREEN}✅ Port 8080 is available${NC}"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use (frontend port)${NC}"
else
    echo -e "${GREEN}✅ Port 3000 is available${NC}"
fi

if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5432 is in use (PostgreSQL port)${NC}"
else
    echo -e "${GREEN}✅ Port 5432 is available${NC}"
fi

if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 6379 is in use (Redis port)${NC}"
else
    echo -e "${GREEN}✅ Port 6379 is available${NC}"
fi
echo ""

# Check if services are running
echo -e "${YELLOW}Checking running services...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
    docker-compose ps
else
    echo -e "${YELLOW}⚠️  No Docker services running${NC}"
    echo -e "${YELLOW}   Run: docker-compose up -d${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}=================================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! You're ready to go!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Run: ${GREEN}./start.sh${NC}"
    echo -e "  2. Open: ${GREEN}http://localhost:3000${NC}"
    echo -e "  3. Test: ${GREEN}./test_api.sh${NC}"
else
    echo -e "${RED}❌ Found $ERRORS critical issue(s)${NC}"
    echo -e "${YELLOW}Please fix the issues above before proceeding${NC}"
fi
echo -e "${BLUE}=================================================${NC}"
