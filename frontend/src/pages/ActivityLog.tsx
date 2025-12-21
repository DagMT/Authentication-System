import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Activity, 
  ArrowLeft, 
  LogIn, 
  LogOut, 
  Key, 
  Mail, 
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  ip?: string;
}

export default function ActivityLog() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    if (!accessToken) {
      toast.error('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/activity-log`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      toast.error('Failed to load activity log');
      console.error('Activity log error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'password': return Key;
      case 'email': return Mail;
      case 'security': return Shield;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return { color: 'text-success', bg: 'bg-success/10' };
      case 'logout': return { color: 'text-muted-foreground', bg: 'bg-secondary/30' };
      case 'password': return { color: 'text-primary', bg: 'bg-primary/10' };
      case 'email': return { color: 'text-info', bg: 'bg-info/10' };
      case 'security': return { color: 'text-warning', bg: 'bg-warning/10' };
      default: return { color: 'text-foreground', bg: 'bg-secondary/30' };
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Activity Log</h1>
            <p className="text-muted-foreground">
              View your recent account activity and security events
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{activities.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <LogIn className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold text-foreground">1</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Session</p>
            </div>
            <div className="bg-gradient-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-info" />
                <span className="text-2xl font-bold text-foreground">Just now</span>
              </div>
              <p className="text-sm text-muted-foreground">Last Activity</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-gradient-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No activity found</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colors = getActivityColor(activity.type);
                  return (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${colors.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(activity.timestamp)}
                          {activity.ip && ` • ${activity.ip}`}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Security Tip
                </p>
                <p className="text-sm text-muted-foreground">
                  Regularly review your activity log to ensure all actions were performed by you. 
                  If you notice any suspicious activity, change your password immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
