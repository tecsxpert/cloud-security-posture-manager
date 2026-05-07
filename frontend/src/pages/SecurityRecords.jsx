import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Filter, Download, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

const fallbackData = [
  { id: 'REC-001', resourceName: 'aws-ec2-web-01', resourceType: 'Compute', severity: 'High', status: 'Open', detectedAt: '2023-10-25' },
  { id: 'REC-002', resourceName: 's3-customer-data', resourceType: 'Storage', severity: 'Critical', status: 'Open', detectedAt: '2023-10-24' },
  { id: 'REC-003', resourceName: 'rds-prod-db', resourceType: 'Database', severity: 'Medium', status: 'Resolved', detectedAt: '2023-10-23' },
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/records');
      // If spring boot pageable
      if (res.data && res.data.content) {
        setRecords(res.data.content);
      } else {
        setRecords(res.data || fallbackData);
      }
    } catch (err) {
      console.error("Backend not running, using fallback data.");
      setRecords(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/api/records/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'security_records.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Export failed. Make sure backend is running.");
    }
  };

  const filteredRecords = records.filter(r => 
    r.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white glow-text">Security Records</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage and track security vulnerabilities</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-white/5 text-white rounded-xl text-sm border border-white/10 hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          
          <label className="flex items-center px-4 py-2 bg-white/5 text-white rounded-xl text-sm border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
            <input type="file" className="hidden" />
          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/records/create')}
            className="flex items-center px-4 py-2 bg-[var(--color-accent)] text-[#0a0f1c] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Record
          </motion.button>
        </div>
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#131b2f] z-10 shadow-md">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((row, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={row.id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)] group-hover:text-white transition-colors">{row.resourceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">{row.resourceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${severityColors[row.severity] || severityColors.Low}`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || statusColors.Open}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/records/edit/${row.id}`)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors p-2 rounded-lg hover:bg-[var(--color-accent)]/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
