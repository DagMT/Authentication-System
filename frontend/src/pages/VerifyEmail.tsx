import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`);
        
        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
        } else {
          const error = await response.json();
          setStatus('error');
          setMessage(error.error || 'Email verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 bg-glow opacity-20" />
      
      <div className="w-full max-w-md relative z-10 text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group justify-center">
          <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-foreground">
            Go<span className="text-gradient">Auth</span>
          </span>
        </Link>

        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Verifying Email</h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Verified!</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
              <XCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
