import { useState, useEffect } from 'react';
import { Search, Clock, User, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

const fallbackLogs = [];

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/audit-logs');
        if (res.data && res.data.content) {
          setLogs(res.data.content);
        } else {
          setLogs(res.data || fallbackLogs);
        }
      } catch (err) {
        console.error("Using fallback audit logs data");
        setLogs(fallbackLogs);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
            </div>
          ) : (
            filteredLogs.map((log, i) => (
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
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
