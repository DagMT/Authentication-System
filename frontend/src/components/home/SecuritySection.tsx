import { Shield, Check } from 'lucide-react';

const securityFeatures = [
  {
    category: 'Password Security',
    items: [
      'bcrypt hashing with cost factor 12+',
      'Minimum password length validation',
      'Password complexity requirements',
      'Time-limited reset tokens',
    ],
  },
  {
    category: 'Token Security',
    items: [
      'Short-lived access tokens (15 min)',
      'Long-lived refresh tokens (7 days)',
      'Token rotation on refresh',
      'Blacklisting for revocation',
    ],
  },
  {
    category: 'Account Protection',
    items: [
      'Failed login tracking',
      'Auto lockout after 5 attempts',
      'Rate limiting per IP & user',
      'Email verification flow',
    ],
  },
  {
    category: 'HTTP Security',
    items: [
      'CORS with configured origins',
      'HSTS & CSP headers',
      'CSRF protection enabled',
      'Input validation & sanitization',
    ],
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Security
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Security First,{' '}
              <span className="text-gradient">Always</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every feature is designed with security as the primary concern. 
              From password hashing to token management, we follow industry best practices
              and OWASP guidelines.
            </p>

            {/* Security Shield Visual */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative glass rounded-2xl p-8 inline-flex items-center gap-6">
                <Shield className="h-16 w-16 text-primary" />
                <div>
                  <div className="text-3xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground">Security Focused</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Security Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((section) => (
              <div
                key={section.category}
                className="bg-gradient-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
