import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

const fallbackAreaData = [];

const fallbackPieData = [];

const COLORS = ['#00f0ff', '#3b82f6', '#8b5cf6'];

const fallbackKpis = [
  { title: 'Security Score', value: '0%', icon: 'Shield', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { title: 'Critical Alerts', value: '0', icon: 'AlertTriangle', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { title: 'Compliant Assets', value: '0', icon: 'CheckCircle', color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
  { title: 'Active Threats', value: '0', icon: 'Activity', color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const iconMap = { Shield, AlertTriangle, CheckCircle, Activity };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    areaData: fallbackAreaData,
    pieData: fallbackPieData,
    kpis: fallbackKpis,
    recentAlerts: []
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        if (res.data) setDashboardData(res.data);
      } catch (err) {
        console.error("Using fallback dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </div>
    );
  }

  const { areaData, pieData, kpis, recentAlerts } = dashboardData;

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white glow-text">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Overview of your cloud security posture</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = iconMap[kpi.icon] || Shield;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-[var(--color-accent)]/50 transition-colors"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${kpi.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{kpi.title}</p>
                  <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                  <IconComponent className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Threat Trend Analysis</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2f', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="high" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" />
                <Area type="monotone" dataKey="medium" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMedium)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Resource Distribution</h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2f', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-[var(--color-text-muted)]">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Top Vulnerable Assets</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2f', borderColor: '#ffffff20', borderRadius: '8px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="high" fill="#00f0ff" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel p-6 rounded-2xl overflow-hidden flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--color-accent)]/30 transition-colors flex items-start gap-4">
                <div className={`mt-1 w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-danger)] bg-[var(--color-danger)] flex-shrink-0`} />
                <div>
                  <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{alert.desc}</p>
                  <span className="text-[10px] text-gray-500 mt-2 block">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
