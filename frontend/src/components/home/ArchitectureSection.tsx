import { CheckCircle2 } from 'lucide-react';

const architectureLayers = [
  {
    title: 'HTTP Layer',
    items: ['Gin Framework', 'CORS & Security Headers', 'Rate Limiting', 'CSRF Protection'],
    color: 'from-primary/20 to-primary/5',
  },
  {
    title: 'Handler Layer',
    items: ['Auth Handlers', 'Health Checks', 'Request Validation', 'Error Handling'],
    color: 'from-info/20 to-info/5',
  },
  {
    title: 'Service Layer',
    items: ['Auth Service', 'Token Service', 'Email Service', 'Cache Service'],
    color: 'from-warning/20 to-warning/5',
  },
  {
    title: 'Repository Layer',
    items: ['sqlc Queries', 'User Repository', 'Session Management', 'Data Access'],
    color: 'from-success/20 to-success/5',
  },
  {
    title: 'Data Layer',
    items: ['Neon PostgreSQL', 'Upstash Redis', 'Connection Pooling', 'Migrations'],
    color: 'from-destructive/20 to-destructive/5',
  },
];

const techStack = [
  { name: 'Go 1.22+', description: 'Modern Go with latest features' },
  { name: 'Gin', description: 'High-performance HTTP framework' },
  { name: 'Neon PostgreSQL', description: 'Serverless PostgreSQL' },
  { name: 'Upstash Redis', description: 'Serverless Redis with TLS' },
  { name: 'sqlc', description: 'Type-safe SQL code generation' },
  { name: 'JWT', description: 'Stateless authentication tokens' },
  { name: 'bcrypt', description: 'Secure password hashing' },
  { name: 'Docker', description: 'Containerization platform' },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 lg:py-32 bg-card/30 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-glow opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Clean Architecture{' '}
            <span className="text-gradient">By Design</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with clean architecture principles for maintainability, testability, and scalability.
            Each layer has a single responsibility and clear boundaries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Architecture Layers */}
          <div className="space-y-4">
            {architectureLayers.map((layer, index) => (
              <div
                key={layer.title}
                className={`relative rounded-xl border border-border p-6 bg-gradient-to-r ${layer.color}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/10 text-foreground text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{layer.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {layer.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="group bg-gradient-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all duration-300"
                >
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tech.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </div>

            {/* Code Block Preview */}
            <div className="mt-8 rounded-xl border border-border bg-background/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Project Structure</span>
              </div>
              <pre className="p-4 text-sm text-muted-foreground overflow-x-auto">
                <code>{`Authentication_System/
├── cmd/api/           # Entry point
├── internal/
│   ├── config/        # Configuration
│   ├── databases/     # DB connections
│   ├── handlers/      # HTTP handlers
│   ├── middleware/    # Middleware
│   ├── models/        # Data models
│   ├── repository/    # Data access
│   ├── services/      # Business logic
│   └── utils/         # Utilities
├── migrations/        # DB migrations
├── frontend/          # React + Vite
└── docker/            # Dockerfiles`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
