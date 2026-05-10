import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { useToast } from '../context/ToastContext';

export default function EditRecord() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    severity: '',
    status: ''
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/api/records/${id}`);
        setFormData(res.data);
      } catch (err) {
        addToast('Failed to fetch record details.', 'error');
        // fallback
        setFormData({
          resourceName: 'aws-ec2-web-01',
          resourceType: 'Compute',
          severity: 'High',
          status: 'Open'
        });
      } finally {
        setFetching(false);
      }
    };
    fetchRecord();
  }, [id, addToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/records/${id}`, formData);
      addToast('Record updated successfully!', 'success');
      navigate('/records');
    } catch (err) {
      addToast('Failed to update record. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/records/${id}`);
      addToast('Record deleted successfully!', 'success');
      navigate('/records');
    } catch (err) {
      addToast('Failed to delete record.', 'error');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white glow-text">Edit Record</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Update vulnerability details</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center px-4 py-2 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#131b2f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-white/10">
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
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#131b2f] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Trash2 className="w-5 h-5 text-rose-400 mr-2" />
                  Confirm Deletion
                </h3>
                <button onClick={() => setShowDeleteModal(false)} className="text-[var(--color-text-muted)] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[var(--color-text-muted)] mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{formData.resourceName}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl text-white bg-white/5 hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-white bg-rose-500 hover:bg-rose-600 transition-colors font-medium text-sm flex items-center disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
