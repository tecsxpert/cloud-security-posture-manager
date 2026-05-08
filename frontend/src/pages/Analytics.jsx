import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, Calendar, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrend: [],
    severityDistribution: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics');
        if (res.data) setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <PageTransition className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white glow-text">Deep Analytics</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Detailed security metrics and trends</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white/5 text-white rounded-xl text-sm border border-white/10 hover:bg-white/10 transition-all">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </button>
          <button className="flex items-center px-4 py-2 bg-[var(--color-accent)] text-[#0a0f1c] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
           <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl flex flex-col"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Vulnerability Trends</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#131b2f', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="medium" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {analyticsData.monthlyTrend.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1c]/50 backdrop-blur-sm rounded-2xl">
                 <span className="text-[var(--color-text-muted)]">No data available</span>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl flex flex-col"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Resolution Time by Severity</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.severityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="severity" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#131b2f', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="avgDaysToResolve" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {analyticsData.severityDistribution.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1c]/50 backdrop-blur-sm rounded-2xl">
                 <span className="text-[var(--color-text-muted)]">No data available</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
