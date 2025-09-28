import React, { useState, useEffect } from 'react';
import { Settings, BarChart3, FileText, AlertTriangle, Plus, X, Loader2 } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDocument } from '../hooks/useFirestore';
import { ResearchEntry, Correction, SocialStats } from '../types';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Social Stats State
  const [stats, setStats] = useState({
    videos: 0,
    followers: 0,
    views: 0,
    likes: 0
  });

  // Research Entry State
  const [researchEntry, setResearchEntry] = useState({
    title: '',
    description: '',
    tags: '',
    sources: [] as { title: string; url: string }[]
  });

  // Correction State
  const [correction, setCorrection] = useState({
    mistake: '',
    correction: '',
    severity: 'low' as 'low' | 'medium' | 'high',
    source: ''
  });

  const { updateDocument: updateStats } = useFirestoreDocument<SocialStats>('stats', 'social-stats');
  const { addItem: addResearchEntry } = useFirestoreCollection<ResearchEntry>('research-entries');
  const { addItem: addCorrection } = useFirestoreCollection<Correction>('corrections');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      showToast('Successfully logged in!', 'success');
    } else {
      showToast('Incorrect password. Please try again.', 'error');
    }
  };

  const handleStatsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStats(stats);
      showToast('Social media stats updated successfully!', 'success');
    } catch (error) {
      showToast('Error updating stats. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagsArray = researchEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await addResearchEntry({
        ...researchEntry,
        tags: tagsArray,
        date: new Date().toISOString().split('T')[0]
      });
      setResearchEntry({ title: '', description: '', tags: '', sources: [] });
      showToast('Research entry added successfully!', 'success');
    } catch (error) {
      showToast('Error adding research entry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCorrection({
        ...correction,
        date: new Date().toISOString().split('T')[0]
      });
      setCorrection({ mistake: '', correction: '', severity: 'low', source: '' });
      showToast('Correction added successfully!', 'success');
    } catch (error) {
      showToast('Error adding correction. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSource = () => {
    const title = prompt('Enter source title:');
    const url = prompt('Enter source URL:');
    if (title && url) {
      setResearchEntry(prev => ({
        ...prev,
        sources: [...prev.sources, { title, url }]
      }));
      showToast('Source added to entry!', 'success');
    } else {
      showToast('Please fill in source title and URL.', 'error');
    }
  };

  const removeSource = (index: number) => {
    setResearchEntry(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 animate-fade-in">
          <div className="text-center mb-6">
            <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-300">Enter password to access admin panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 hover:shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'stats', label: 'Social Stats', icon: BarChart3 },
              { id: 'research', label: 'Add Research', icon: FileText },
              { id: 'corrections', label: 'Add Correction', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="ml-2 text-gray-300">Loading admin panel...</span>
              </div>
            )}

            {/* Social Stats Tab */}
            {activeTab === 'stats' && (
              <div className="animate-slide-in">
                <h2 className="text-xl font-bold text-white mb-6">Update Social Media Stats</h2>
                <form onSubmit={handleStatsUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Total Videos</label>
                      <input
                        type="number"
                        value={stats.videos}
                        onChange={(e) => setStats(prev => ({ ...prev, videos: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Total Followers</label>
                      <input
                        type="number"
                        value={stats.followers}
                        onChange={(e) => setStats(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Total Views</label>
                      <input
                        type="number"
                        value={stats.views}
                        onChange={(e) => setStats(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Total Likes</label>
                      <input
                        type="number"
                        value={stats.likes}
                        onChange={(e) => setStats(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Stats'}
                  </button>
                </form>
              </div>
            )}

            {/* Research Entry Tab */}
            {activeTab === 'research' && (
              <div className="animate-slide-in">
                <h2 className="text-xl font-bold text-white mb-6">Add Research Entry</h2>
                <form onSubmit={handleResearchSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={researchEntry.title}
                      onChange={(e) => setResearchEntry(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={researchEntry.description}
                      onChange={(e) => setResearchEntry(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={researchEntry.tags}
                      onChange={(e) => setResearchEntry(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="space, astronomy, physics"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Sources */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-300">Sources</label>
                      <button
                        type="button"
                        onClick={addSource}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                      >
                        <Plus size={16} />
                        Add Source
                      </button>
                    </div>
                    {researchEntry.sources.map((source, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2 p-3 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium">{source.title}</p>
                          <p className="text-gray-400 text-sm">{source.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSource(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding Entry...' : 'Add Research Entry'}
                  </button>
                </form>
              </div>
            )}

            {/* Corrections Tab */}
            {activeTab === 'corrections' && (
              <div className="animate-slide-in">
                <h2 className="text-xl font-bold text-white mb-6">Add Correction</h2>
                <form onSubmit={handleCorrectionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Mistake Description</label>
                    <textarea
                      value={correction.mistake}
                      onChange={(e) => setCorrection(prev => ({ ...prev, mistake: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Correction</label>
                    <textarea
                      value={correction.correction}
                      onChange={(e) => setCorrection(prev => ({ ...prev, correction: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Severity</label>
                    <select
                      value={correction.severity}
                      onChange={(e) => setCorrection(prev => ({ ...prev, severity: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Source (Video/Content)</label>
                    <input
                      type="text"
                      value={correction.source}
                      onChange={(e) => setCorrection(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="Video title or content reference"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding Correction...' : 'Add Correction'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};