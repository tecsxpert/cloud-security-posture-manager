import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <header className="h-16 flex-shrink-0 glass-panel border-b border-white/5 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full bg-[var(--color-primary)]/50 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
            placeholder="Search resources, alerts..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-[var(--color-danger)] shadow-[0_0_8px_var(--color-danger)]"></span>
        </motion.button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-white">Admin User</span>
            <span className="text-xs text-[var(--color-text-muted)]">Security Ops</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-primary)] p-0.5"
          >
            <div className="w-full h-full rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
