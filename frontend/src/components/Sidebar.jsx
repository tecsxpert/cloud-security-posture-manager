import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, Activity, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Security Records', icon: ShieldAlert, path: '/records' },
  { name: 'Audit Logs', icon: FileText, path: '/audit-logs' },
  { name: 'Analytics', icon: Activity, path: '/analytics' },
];

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 flex-shrink-0 glass-panel border-r border-white/5 h-full flex flex-col z-20"
    >
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <ShieldCheck className="w-8 h-8 text-[var(--color-accent)] mr-3 glow-text" />
        <span className="text-lg font-bold text-white tracking-wide glow-text">Sentinel</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "text-[var(--color-accent)] bg-white/5 glow-border" 
                : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" 
                  />
                )}
                <item.icon className={cn("w-5 h-5 mr-3 z-10 transition-transform group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]")} />
                <span className="font-medium z-10">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="flex w-full items-center px-4 py-3 text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 rounded-xl transition-all group">
          <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
          <span className="font-medium">Settings</span>
        </button>
        <NavLink to="/" className="flex w-full items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all group">
          <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </NavLink>
      </div>
    </motion.aside>
  );
}
