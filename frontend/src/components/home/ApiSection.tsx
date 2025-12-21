import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

const endpoints = [
  {
    method: 'POST',
    path: '/auth/register',
    description: 'Create new user account',
    auth: false,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: 'Authenticate user',
    auth: false,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    description: 'Refresh access token',
    auth: false,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'POST',
    path: '/auth/logout',
    description: 'Revoke tokens',
    auth: true,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'GET',
    path: '/auth/verify',
    description: 'Verify email address',
    auth: false,
    color: 'bg-info/20 text-info',
  },
  {
    method: 'POST',
    path: '/auth/password/forgot',
    description: 'Request password reset',
    auth: false,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'POST',
    path: '/auth/password/reset',
    description: 'Reset password',
    auth: false,
    color: 'bg-success/20 text-success',
  },
  {
    method: 'GET',
    path: '/api/profile',
    description: 'Get user profile',
    auth: true,
    color: 'bg-info/20 text-info',
  },
  {
    method: 'GET',
    path: '/health',
    description: 'Health check',
    auth: false,
    color: 'bg-info/20 text-info',
  },
];

const codeExample = `// Register a new user
curl -X POST http://localhost:8080/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}`;

export function ApiSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-24 lg:py-32 bg-card/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            API Reference
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            RESTful API{' '}
            <span className="text-gradient">Endpoints</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, intuitive API design following REST best practices. 
            Clear endpoints with consistent response formats.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Endpoints Table */}
          <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Endpoints</h3>
            </div>
            <div className="divide-y divide-border">
              {endpoints.map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
                >
                  <span className={`px-2 py-1 rounded text-xs font-bold ${endpoint.color}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-foreground font-mono flex-1">
                    {endpoint.path}
                  </code>
                  {endpoint.auth && (
                    <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                      Auth
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div>
            <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Example Request</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="p-4 text-sm text-muted-foreground overflow-x-auto max-h-[400px]">
                <code>{codeExample}</code>
              </pre>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <a
                href="#quickstart"
                className="p-4 rounded-xl border border-border bg-gradient-card hover:border-primary/50 transition-colors"
              >
                <h4 className="font-semibold text-foreground mb-1">Quick Start</h4>
                <p className="text-sm text-muted-foreground">Get running in 5 minutes</p>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border bg-gradient-card hover:border-primary/50 transition-colors"
              >
                <h4 className="font-semibold text-foreground mb-1">Full Docs</h4>
                <p className="text-sm text-muted-foreground">Complete API reference</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
