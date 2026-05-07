import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const mockData = [
  { id: 'REC-001', resource: 'aws-ec2-web-01', type: 'Compute', severity: 'High', status: 'Open', date: '2023-10-25' },
  { id: 'REC-002', resource: 's3-customer-data', type: 'Storage', severity: 'Critical', status: 'Open', date: '2023-10-24' },
  { id: 'REC-003', resource: 'rds-prod-db', type: 'Database', severity: 'Medium', status: 'Resolved', date: '2023-10-23' },
  { id: 'REC-004', resource: 'iam-admin-role', type: 'Identity', severity: 'High', status: 'In Progress', date: '2023-10-23' },
  { id: 'REC-005', resource: 'aks-cluster-01', type: 'Container', severity: 'Low', status: 'Resolved', date: '2023-10-22' },
];

const severityColors = {
  Critical: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  High: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

const statusColors = {
  'Open': 'text-rose-400 bg-rose-400/10',
  'In Progress': 'text-blue-400 bg-blue-400/10',
  'Resolved': 'text-emerald-400 bg-emerald-400/10',
};

export default function SecurityRecords() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <PageTransition className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white glow-text">Security Records</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage and track security vulnerabilities</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-[var(--color-accent)] text-[#0a0f1c] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Record
        </motion.button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          
          <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 mr-2 text-[var(--color-text-muted)]" />
            Filters
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#131b2f] z-10 shadow-md">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Record ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockData.map((row, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={row.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)] group-hover:text-white transition-colors">{row.resource}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">{row.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${severityColors[row.severity]}`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors p-1 rounded-lg hover:bg-[var(--color-accent)]/10">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
