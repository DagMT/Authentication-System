# 🔐 Go Authentication System

Production-ready authentication system built with Go 1.22+, PostgreSQL (Neon), Redis (Upstash), and modern security features.

## 🚀 Quick Deploy

### Vercel (Frontend) + Render (Backend)
```bash
# Quick deploy script
./deploy-vercel.sh

# Or follow the guide
See: VERCEL_RENDER_DEPLOY.md
```

### Local Testing (Docker Compose)
```bash
# Production mode (Neon + Upstash)
./scripts/deploy.sh

# Development mode (Local PostgreSQL + Redis)
./scripts/deploy.sh dev
```

### Render Deployment (Backend Only)

#### Backend Deployment
1. Create new **Web Service** on Render
2. Connect your repository
3. Configure:
   - **Environment**: Docker
   - **Dockerfile Path**: `./docker/Dockerfile`
   - **Docker Context**: `.`
4. Add environment variables from `.env.render`:
   ```
   NEON_DATABASE_URL=postgresql://...
   UPSTASH_REDIS_URL=host:6379
   UPSTASH_REDIS_TOKEN=your_token
   JWT_SECRET=<use: openssl rand -base64 32>
   FRONTEND_URL=https://your-app.vercel.app
   SMTP_USER=your_email
   SMTP_PASS=your_password
   EMAIL_FROM=your_email
   ENV=production
   CSRF_PROTECTION=true
   ```
5. Deploy!

#### Run Migrations
```bash
migrate -path migrations \
  -database "$NEON_DATABASE_URL" \
  up
```

## 📁 Project Structure

```
.
├── cmd/api/              # Application entry point
├── internal/             # Private application code
│   ├── config/          # Consleep 5 && docker-compose logs --tail=10 backendfiguration
│   ├── databases/       # DB connections (Neon/Upstash)
│   ├── handlers/        # HTTP handlers
│   ├── middleware/      # Middleware
│   ├── models/          # Data models
│   ├── repository/      # Data access
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── frontend/            # React frontend
│   ├── src/
│   ├── Dockerfile       # Frontend Docker (Render)
│   └── .env.render      # Frontend env template
├── migrations/          # Database migrations
├── docker/
│   └── Dockerfile       # Backend Docker (Render)
├── documentation/       # All .md files
├── scripts/            # All .sh scripts
├── docker-compose.yml  # Local testing
├── .env                # Local config
├── .env.render         # Render backend template
└── render.yaml         # Render blueprint
```

## 🗄️ Database & Cache

### Neon PostgreSQL (Production)
- Serverless PostgreSQL
- Auto-scaling
- Connection pooling
- Set via `NEON_DATABASE_URL`

### Upstash Redis (Production)
- Serverless Redis
- TLS enabled
- Global replication
- Set via `UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN`

### Local Development
- Docker Compose with local PostgreSQL + Redis
- Use `./scripts/deploy.sh dev`

## 📚 Documentation

### Deployment Guides
- **[Vercel + Render](VERCEL_RENDER_DEPLOY.md)** - Deploy frontend to Vercel, backend to Render
- **[Quick Deploy](DEPLOY_QUICK.md)** - Quick reference card
- **[Security Checklist](SECURITY_CHECKLIST.md)** - Pre-deployment security audit
- **[Production Ready](PRODUCTION_READY.md)** - Final deployment checklist

### Development Guides
- [START HERE](documentation/START_HERE.md) - New to the project?
- [Setup Guide](documentation/SETUP_GUIDE.md) - Complete setup
- [API Documentation](documentation/API_DOCUMENTATION.md) - API endpoints
- [Architecture](documentation/ARCHITECTURE.md) - System design
- [Development Guide](documentation/DEVELOPMENT_GUIDE.md) - Development workflow
- [Testing Guide](documentation/TESTING_GUIDE.md) - Testing

## 🛠️ Scripts

### Deployment
- `./deploy-vercel.sh` - Deploy to Vercel + Render
- `./pre-deploy-check.sh` - Security check before deployment

### Development
- `scripts/deploy.sh` - Deploy locally (prod/dev)
- `scripts/check_setup.sh` - Verify setup
- `scripts/test_endpoints.sh` - Test API
- `scripts/manage_users.sh` - User management

### Keep-Alive
- `npm run ping` - Single health check
- `npm run keep-alive` - Continuous pinging (10min interval)

## ✨ Features

- ✅ JWT + Refresh Token Authentication
- ✅ Email Verification
- ✅ Password Reset Flow
- ✅ Rate Limiting (IP + User based)
- ✅ Account Lockout (5 failed attempts)
- ✅ CSRF Protection
- ✅ XSS Protection
- ✅ SQL Injection Prevention (sqlc)
- ✅ Secure Password Hashing (bcrypt)
- ✅ Health Checks
- ✅ Structured Logging
- ✅ Docker Ready
- ✅ Render Ready

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|----------|
| Backend | Go 1.22+ + Gin | HTTP framework |
| Database | PostgreSQL (Neon) | Data storage |
| Cache | Redis (Upstash) | Session + rate limiting |
| Frontend | React + TypeScript + Vite | UI |
| SQL | sqlc | Type-safe queries |
| Deployment | Docker + Vercel + Render | Containerization & hosting |

## 🔒 Security Features

- bcrypt password hashing (cost 12+)
- JWT with short-lived access tokens (15min)
- Refresh token rotation
- Rate limiting per IP and user
- Account lockout after failed attempts
- CSRF token validation
- Security headers (HSTS, CSP, etc.)
- Input validation and sanitization
- SQL injection prevention (sqlc)
- TLS for external services

## 🚦 Environment Variables

### Backend (.env.render)
```env
NEON_DATABASE_URL=postgresql://...
UPSTASH_REDIS_URL=host:port
UPSTASH_REDIS_TOKEN=token
JWT_SECRET=<use: openssl rand -base64 32>
FRONTEND_URL=https://your-app.vercel.app
SMTP_USER=email
SMTP_PASS=password
EMAIL_FROM=email
ENV=production
CSRF_PROTECTION=true
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com
```

**Generate JWT Secret**:
```bash
openssl rand -base64 32
```

## 📊 Deployment Options

### Option 1: Vercel + Render (Recommended)

**Frontend (Vercel)**:
- Automatic CDN
- Zero config
- Free SSL
- Deploy: `vercel`

**Backend (Render)**:
- Docker deployment
- Auto-scaling
- Free SSL
- Health checks


### Option 2: Render Only (Both Services)

**Backend**: Web Service (Docker)
- Uses `docker/Dockerfile`
- Requires Neon PostgreSQL and Upstash Redis
- Set environment variables from `.env.render`

**Frontend**: Static Site (Recommended) or Web Service
- **Static Site**: No Docker, Render serves built files directly (free tier available)
- **Web Service**: Uses `frontend/Dockerfile` with nginx (more control, costs more)
- Both options work; Static Site is simpler for most use cases

**External Services**:
- Database: Neon PostgreSQL
- Cache: Upstash Redis

### Option 3: Docker Compose (Local Testing)
```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose --profile dev up -d
```

### Option 4: Manual Docker
```bash
# Backend
docker build -f docker/Dockerfile -t backend .
docker run -p 8080:8080 --env-file .env.render backend

# Frontend
cd frontend
docker build -t frontend .
docker run -p 3000:80 frontend
```

## 🧪 Testing

```bash
# Test all endpoints
./scripts/test_endpoints.sh

# Check health
curl http://localhost:8080/health

# Run Go tests
go test -v ./...
```

## 📈 Monitoring

### Health Endpoints
- `/health` - Full health check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Response Example
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- **GitHub**: [Issues](https://github.com/Flack74/Authentication-System/issues)
- **Documentation**: See guides above
- **Email**: flack74621@gmail.com

---

**Status**: ✅ Production Ready | 🚀 Vercel + Render Ready | 🔒 Security Hardened

Built with ❤️ by [Flack](https://github.com/Flack74)
