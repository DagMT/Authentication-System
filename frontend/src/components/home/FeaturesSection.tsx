import { 
  Shield, 
  Key, 
  RefreshCcw, 
  Lock, 
  Mail, 
  Clock, 
  Server, 
  Database, 
  Zap,
  ShieldCheck,
  Code2,
  Container
} from 'lucide-react';

const features = [
  {
    icon: Key,
    title: 'JWT Authentication',
    description: 'Short-lived access tokens with long-lived refresh tokens for secure, stateless authentication.',
  },
  {
    icon: Lock,
    title: 'bcrypt Hashing',
    description: 'Industry-standard password hashing with configurable cost factor for maximum security.',
  },
  {
    icon: RefreshCcw,
    title: 'Token Rotation',
    description: 'Automatic token rotation on refresh with blacklisting for immediate revocation.',
  },
  {
    icon: Shield,
    title: 'Rate Limiting',
    description: 'Redis-powered sliding window rate limiting per IP and per user.',
  },
  {
    icon: Clock,
    title: 'Account Lockout',
    description: 'Automatic lockout after failed login attempts to prevent brute force attacks.',
  },
  {
    icon: Mail,
    title: 'Email Verification',
    description: 'Secure email verification flow with time-limited tokens.',
  },
  {
    icon: ShieldCheck,
    title: 'CSRF Protection',
    description: 'Redis-based CSRF token validation to prevent cross-site request forgery.',
  },
  {
    icon: Code2,
    title: 'Security Headers',
    description: 'HSTS, CSP, X-Frame-Options, and XSS protection headers enabled by default.',
  },
  {
    icon: Database,
    title: 'PostgreSQL',
    description: 'Reliable persistent storage with type-safe sqlc queries and connection pooling.',
  },
  {
    icon: Zap,
    title: 'Redis Caching',
    description: 'High-performance session management, caching, and rate limiting.',
  },
  {
    icon: Container,
    title: 'Docker Ready',
    description: 'Fully containerized with health checks and graceful shutdown handling.',
  },
  {
    icon: Server,
    title: 'Production Ready',
    description: 'Battle-tested for production with monitoring, logging, and CI/CD pipelines.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything You Need for{' '}
            <span className="text-gradient">Secure Authentication</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive authentication system with enterprise-grade security features,
            built for scalability and ease of deployment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-gradient-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
