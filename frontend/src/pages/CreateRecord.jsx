import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { useToast } from '../context/ToastContext';

export default function CreateRecord() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: 'Compute',
    severity: 'Medium',
    status: 'Open'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/records', formData);
      addToast('Record created successfully!', 'success');
      navigate('/records');
    } catch (err) {
      addToast('Failed to create record. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/records')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white glow-text">Create Record</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Add a new security vulnerability to track</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Resource Name</label>
            <input
              required
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="e.g. aws-ec2-web-01"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Resource Type</label>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#131b2f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="Compute">Compute</option>
                <option value="Storage">Storage</option>
                <option value="Database">Database</option>
                <option value="Identity">Identity</option>
                <option value="Container">Container</option>
                <option value="Network">Network</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#131b2f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/records')}
              className="px-6 py-2.5 rounded-xl text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[var(--color-accent)] text-[#0a0f1c] rounded-xl font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all flex items-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {loading ? 'Saving...' : 'Save Record'}
            </motion.button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
