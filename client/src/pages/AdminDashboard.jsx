/**
 * NextGen CMA — Admin Dashboard
 * Simple premium placeholder displaying system metrics and admin controls.
 */

import { Users, ShieldCheck, Database, Award } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white relative z-10">
          Admin Console
        </h1>
        <p className="text-zinc-500 text-sm mt-1.5 relative z-10">
          Welcome back, {user?.name}. System logs and database connections are operational.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-display">
                Total Students
              </span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                1,248
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Users size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-display">
                System Status
              </span>
              <span className="text-2xl font-bold font-display text-green-400 mt-1 block">
                99.9%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <ShieldCheck size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-display">
                DB Connections
              </span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                Active
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple-light">
              <Database size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-display">
                CMA Pass Rate
              </span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                87.4%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Award size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <h2 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border pb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/services" className="w-full">
              <Button variant="outline" className="w-full justify-start text-left">
                Manage Services CMS
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-left">
              Send Platform Announcement
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              View Access Logs
            </Button>
            <Link to="/admin/cms" className="w-full">
              <Button variant="gold" className="w-full justify-start text-left">
                Manage Brand CMS (Homepage)
              </Button>
            </Link>
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <h2 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border pb-3">
            Environment Logs
          </h2>
          <div className="space-y-4 text-xs font-mono text-zinc-500">
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span>Environment:</span>
              <span className="text-zinc-300">Production</span>
            </div>
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span>Node Version:</span>
              <span className="text-zinc-300">v20.11.0</span>
            </div>
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span>ORM Client:</span>
              <span className="text-zinc-300">Prisma Client</span>
            </div>
            <div className="flex justify-between pb-2">
              <span>Token Expiry:</span>
              <span className="text-zinc-300">15m (Access) / 7d (Refresh)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
