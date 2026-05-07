import { useState } from 'react';
import { Search, Clock, User, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const mockLogs = [
  { id: 1, action: 'Created Security Record', entity: 'aws-ec2-web-01', user: 'admin@enterprise.com', time: '10 mins ago', type: 'create' },
  { id: 2, action: 'Updated Severity', entity: 's3-customer-data', user: 'security_ops@enterprise.com', time: '1 hour ago', type: 'update' },
  { id: 3, action: 'Resolved Vulnerability', entity: 'rds-prod-db', user: 'admin@enterprise.com', time: '3 hours ago', type: 'resolve' },
  { id: 4, action: 'Deleted Record', entity: 'aks-cluster-01', user: 'admin@enterprise.com', time: '1 day ago', type: 'delete' },
];

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <PageTransition className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white glow-text">Audit Logs</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Track all system actions and changes</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden p-6">
        <div className="relative w-full max-w-md group mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
          <input
            type="text"
            placeholder="Search logs by user, action, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <div className="flex-1 overflow-auto space-y-4 pr-2">
          {mockLogs.map((log, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={log.id} 
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4 hover:border-white/20 transition-all"
            >
              <div className="p-2 bg-[#131b2f] rounded-lg border border-white/10 mt-1">
                {log.type === 'create' ? <ShieldAlert className="w-5 h-5 text-emerald-400" /> : 
                 log.type === 'delete' ? <ShieldAlert className="w-5 h-5 text-rose-400" /> :
                 <ShieldAlert className="w-5 h-5 text-[var(--color-accent)]" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{log.action}</h4>
                  <div className="flex items-center text-xs text-[var(--color-text-muted)]">
                    <Clock className="w-3 h-3 mr-1" />
                    {log.time}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Resource: <span className="text-white font-medium">{log.entity}</span></p>
                <div className="flex items-center text-xs text-[var(--color-text-muted)] mt-2 bg-[#131b2f] w-fit px-2 py-1 rounded-md border border-white/5">
                  <User className="w-3 h-3 mr-1" />
                  {log.user}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
