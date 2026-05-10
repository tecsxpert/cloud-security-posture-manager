import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border-t border-l border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center glow-border mb-4">
          <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-2xl font-bold text-white glow-text">Sentinel CSPM</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">Sign in to your dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-[var(--color-primary)]/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              placeholder="admin@enterprise.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-[var(--color-primary)]/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-offset-gray-900"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text-muted)]">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors">
            Forgot password?
          </a>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0a0f1c] bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-offset-[var(--color-primary)] transition-all"
        >
          Access Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </motion.button>
      </form>
    </div>
  );
}
