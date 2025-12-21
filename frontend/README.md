# Frontend - Go Authentication System

Modern React + TypeScript frontend for the Go Authentication System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Access

- **Development**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── home/           # Home page sections
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # User dashboard
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── VerifyEmail.tsx
├── lib/                # Utilities and context
│   ├── auth-context.tsx  # Authentication context
│   └── utils.ts        # Helper functions
└── App.tsx             # Main app component
```

## 🎨 Features

- ✅ User Registration with password validation
- ✅ Secure Login
- ✅ Email Verification
- ✅ Password Reset Flow
- ✅ Protected Dashboard
- ✅ Token Management (Access + Refresh)
- ✅ Responsive Design
- ✅ Dark Mode Support
- ✅ Form Validation (React Hook Form + Zod)
- ✅ Toast Notifications

## 🔧 Configuration

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tanstack Query** - Data fetching
- **Sonner** - Toast notifications

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔐 Authentication Flow

1. **Register**: User creates account → Email verification sent
2. **Verify Email**: User clicks link from email
3. **Login**: User authenticates → Receives access + refresh tokens
4. **Dashboard**: Protected route, requires valid token
5. **Token Refresh**: Automatic refresh when access token expires
6. **Logout**: Tokens revoked on backend

## 🎯 Key Components

### AuthContext (`lib/auth-context.tsx`)
Manages authentication state and provides methods:
- `login(email, password)`
- `register(email, password)`
- `logout()`
- `refreshAccessToken()`
- `forgotPassword(email)`
- `resetPassword(token, password)`

### Protected Routes
Dashboard and other protected pages check authentication status:
```tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    navigate('/login');
  }
}, [isAuthenticated, isLoading, navigate]);
```

## 🎨 Styling

Uses TailwindCSS with custom configuration:
- Custom color palette
- Gradient utilities
- Animation classes
- Responsive breakpoints

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### API Connection Issues
- Ensure backend is running on port 8080
- Check `.env` file has correct `VITE_API_URL`
- Verify CORS is enabled on backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)

---

**Part of the Go Authentication System**
