<div align="center">

# 🔐 Go Authentication System

### Enterprise-Grade Authentication Built with Go 1.22+

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=for-the-badge&logo=go)](https://go.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

**Production-ready authentication system with PostgreSQL (Neon), Redis (Upstash), and modern security features**

[🚀 Quick Start](#-quick-deploy) • [📖 Documentation](#-documentation) • [✨ Features](#-features) • [🔒 Security](#-security-features)

</div>

---

## 🚀 Quick Deploy

<table>
<tr>
<td width="50%">

### 🎨 Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

</td>
<td width="50%">

### ⚙️ Backend (Render)
1. Create Web Service on Render
2. Set Dockerfile: `./docker/Dockerfile`
3. Add environment variables
4. Deploy!

</td>
</tr>
</table>

### 🐳 Local Development

```bash
# Production mode (Neon + Upstash)
docker-compose up -d

# Development mode (Local DB)
docker-compose --profile dev up -d
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- ✅ JWT + Refresh Tokens
- ✅ Email Verification
- ✅ Password Reset Flow
- ✅ Session Management
- ✅ 2FA Support

</td>
<td width="50%">

### 🛡️ Security
- ✅ Rate Limiting (IP + User)
- ✅ Account Lockout (5 attempts)
- ✅ CSRF Protection
- ✅ XSS Protection
- ✅ SQL Injection Prevention

</td>
</tr>
<tr>
<td width="50%">

### 📊 Infrastructure
- ✅ Health Checks
- ✅ Structured Logging
- ✅ Docker Ready
- ✅ Auto-scaling

</td>
<td width="50%">

### 🚀 Deployment
- ✅ Vercel (Frontend)
- ✅ Render (Backend)
- ✅ Neon PostgreSQL
- ✅ Upstash Redis

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Backend** | ![Go](https://img.shields.io/badge/Go_1.22+-00ADD8?style=flat&logo=go&logoColor=white) ![Gin](https://img.shields.io/badge/Gin-00ADD8?style=flat) | HTTP Framework |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) | Serverless Database |
| **Cache** | ![Redis](https://img.shields.io/badge/Upstash_Redis-DC382D?style=flat&logo=redis&logoColor=white) | Session & Rate Limiting |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | UI Framework |
| **SQL** | ![sqlc](https://img.shields.io/badge/sqlc-000000?style=flat) | Type-safe Queries |
| **Deploy** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel) ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white) | Containerization & Hosting |

</div>

---

## 🔒 Security Features

- **🔐 Password Security**: bcrypt hashing (cost 12+)
- **🎫 JWT Authentication**: Short-lived access tokens (15min)
- **🔄 Token Rotation**: Automatic refresh token rotation
- **⏱️ Rate Limiting**: Per IP and per user protection
- **🔒 Account Lockout**: 5 failed attempts = 30min lockout
- **🛡️ CSRF Protection**: Token validation on state-changing operations
- **🔰 Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **✅ Input Validation**: Sanitization and validation on all inputs
- **🚫 SQL Injection**: Prevention via sqlc type-safe queries
- **🔐 TLS**: Encrypted connections to all external services

---

## 📁 Project Structure

```
.
├── cmd/api/              # Application entry point
├── internal/             # Private application code
│   ├── config/          # Configuration
│   ├── databases/       # DB connections (Neon/Upstash)
│   ├── handlers/        # HTTP handlers
│   ├── middleware/      # Middleware
│   ├── models/          # Data models
│   ├── repository/      # Data access
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── frontend/            # React frontend
│   ├── src/
│   └── Dockerfile       # Frontend Docker
├── migrations/          # Database migrations
├── docker/
│   └── Dockerfile       # Backend Docker
├── docker-compose.yml   # Local testing
└── vercel.json          # Vercel config
```

---

## 🗄️ Database & Cache

<table>
<tr>
<td width="50%">

### 🐘 Neon PostgreSQL
- Serverless PostgreSQL
- Auto-scaling
- Connection pooling
- Set via `NEON_DATABASE_URL`

</td>
<td width="50%">

### ⚡ Upstash Redis
- Serverless Redis
- TLS enabled
- Global replication
- Set via `UPSTASH_REDIS_URL`

</td>
</tr>
</table>

---

## 📚 Documentation

<table>
<tr>
<td width="50%">

### 🚀 Deployment
- Vercel + Render deployment guide
- Quick deploy reference
- Security checklist
- Production ready guide

</td>
<td width="50%">

### 🔧 Keep-Alive
- `npm run ping` - Health check
- `npm run keep-alive` - Auto-ping (10min)
- Keep-alive documentation

</td>
</tr>
</table>

---

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

---

## 📊 Deployment Options

### 🥇 Option 1: Vercel + Render (Recommended)

<table>
<tr>
<td width="50%" align="center">

**Frontend (Vercel)**

✅ Automatic CDN  
✅ Zero Config  
✅ Free SSL  
✅ Edge Network  

`vercel --prod`

</td>
<td width="50%" align="center">

**Backend (Render)**

✅ Docker Deploy  
✅ Auto-scaling  
✅ Free SSL  
✅ Health Checks  

[Deploy Now →](https://render.com)

</td>
</tr>
</table>

### 🥈 Option 2: Docker Compose (Local)

```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose --profile dev up -d
```

### 🥉 Option 3: Manual Docker

```bash
# Backend
docker build -f docker/Dockerfile -t backend .
docker run -p 8080:8080 --env-file .env backend

# Frontend
cd frontend && docker build -t frontend .
docker run -p 3000:80 frontend
```

---

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

---

## 🆘 Support & Contributing

<div align="center">

### 💬 Get Help

[![GitHub Issues](https://img.shields.io/github/issues/Flack74/Authentication-System?style=for-the-badge)](https://github.com/Flack74/Authentication-System/issues)
[![Email](https://img.shields.io/badge/Email-flack74621%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:flack74621@gmail.com)

### 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch: `git checkout -b feature/name`
3. 💾 Commit changes: `git commit -am 'Add feature'`
4. 📤 Push to branch: `git push origin feature/name`
5. 🔀 Submit pull request

### 📄 License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/Flack74/Authentication-System?style=social)](https://github.com/Flack74/Authentication-System/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Flack74/Authentication-System?style=social)](https://github.com/Flack74/Authentication-System/network/members)

**Status**: ✅ Production Ready | 🚀 Vercel + Render Ready | 🔒 Security Hardened

Built with ❤️ by [Flack](https://github.com/Flack74)

</div>

</div>
