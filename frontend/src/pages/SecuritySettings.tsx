import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Key, Smartphone, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function SecuritySettings() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = () => {
    navigate('/forgot-password');
  };

  const handleToggle2FA = async () => {
    if (!accessToken) {
      toast.error('Not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      const newState = !twoFactorEnabled;
      const response = await fetch(`${API_URL}/api/2fa/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ enabled: newState }),
      });
      
      if (!response.ok) throw new Error('Failed to update 2FA');
      
      setTwoFactorEnabled(newState);
      toast.success(newState ? '2FA enabled successfully' : '2FA disabled successfully');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Settings</h1>
            <p className="text-muted-foreground">Manage your account security and authentication methods</p>
          </div>

          <div className="space-y-6">
            {/* Password Section */}
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Change your password to keep your account secure
                    </p>
                    <Button onClick={handlePasswordChange}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant={twoFactorEnabled ? "destructive" : "default"}
                        onClick={handleToggle2FA}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : (twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}
                      </Button>
                      {twoFactorEnabled && (
                        <span className="text-sm text-success font-medium">✓ Enabled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage devices where you're currently logged in
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">Current Device</p>
                        <p className="text-xs text-muted-foreground">Last active: Just now</p>
                      </div>
                      <span className="text-xs text-success font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Account Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your account security status
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-success">✓</span>
                      <span className="text-foreground">Email verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-success">✓</span>
                      <span className="text-foreground">Strong password</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={twoFactorEnabled ? "text-success" : "text-muted-foreground"}>
                        {twoFactorEnabled ? "✓" : "○"}
                      </span>
                      <span className="text-foreground">Two-factor authentication</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-card rounded-xl border border-destructive/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Irreversible actions for your account
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => toast.error('Account deletion is not available in demo')}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
