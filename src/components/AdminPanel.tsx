import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Plus, BookOpen, AlertTriangle, FileText, Globe, Video, ExternalLink, CheckCircle, X } from 'lucide-react';
import { useFirestoreDocument } from '../hooks/useFirestore';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { SocialStats, ResearchEntry, Correction, Source } from '../types';

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in-right ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-75">
      <X className="h-4 w-4" />
    </button>
  </div>
);
export default function AdminPanel() {
  const { data: stats, loading, updateDocument } = useFirestoreDocument<SocialStats>('stats', 'social-stats');
  const { addItem: addEntry } = useFirestoreCollection<ResearchEntry>('research-entries');
  const { addItem: addCorrection } = useFirestoreCollection<Correction>('corrections');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    videos: stats?.videos || 0,
    followers: stats?.followers || 0,
    views: stats?.views || 0,
    likes: stats?.likes || 0
  });
  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  // Research Entry Form
  const [researchFormData, setResearchFormData] = useState({
    contentNumber: '',
    title: '',
    platform: 'youtube' as const,
    contentType: 'video' as const,
    description: '',
    tags: '',
    sources: [] as Omit<Source, 'id'>[]
  });

  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    type: 'article' as const,
    credibility: 'high' as const,
    notes: ''
  });

  // Correction Form
  const [correctionFormData, setCorrectionFormData] = useState({
    contentNumber: '',
    title: '',
    platform: 'youtube' as const,
    mistakeDescription: '',
    correction: '',
    severity: 'minor' as const,
    status: 'pending' as const
  });

  React.useEffect(() => {
    if (stats) {
      setFormData({
        videos: stats.videos,
        followers: stats.followers,
        views: stats.views,
        likes: stats.likes
      });
    }
  }, [stats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Default password
      setIsAuthenticated(true);
      setPassword('');
      showToast('Successfully logged in!', 'success');
    } else {
      showToast('Incorrect password. Please try again.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      console.log('Updating stats:', formData);
      await updateDocument({
        ...formData,
        lastUpdated: new Date().toISOString()
      });
      showToast('Social media stats updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating stats:', error);
      showToast('Error updating stats. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const entry = {
      ...researchFormData,
      sources: researchFormData.sources.map(source => ({ ...source, id: Date.now().toString() + Math.random() })),
      tags: researchFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      uploadDate: new Date().toISOString()
    };
    addEntry(entry);
    setResearchFormData({
      contentNumber: '',
      title: '',
      platform: 'youtube',
      contentType: 'video',
      description: '',
      tags: '',
      sources: []
    });
      showToast('Research entry added successfully!', 'success');
    } catch (error) {
      showToast('Error adding research entry. Please try again.', 'error');
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const correction = {
      ...correctionFormData,
      correctionDate: new Date().toISOString()
    };
    addCorrection(correction);
    setCorrectionFormData({
      contentNumber: '',
      title: '',
      platform: 'youtube',
      mistakeDescription: '',
      correction: '',
      severity: 'minor',
      status: 'pending'
    });
    alert('Correction added successfully!');
  };

  const addSource = () => {
    if (newSource.title && newSource.url) {
      setResearchFormData(prev => ({
        ...prev,
        sources: [...prev.sources, newSource]
      }));
      setNewSource({
        title: '',
        url: '',
        type: 'article',
        credibility: 'high',
        notes: ''
      });
    }
      showToast('Correction added successfully!', 'success');
    } catch (error) {
      showToast('Error adding correction. Please try again.', 'error');
    }

  const removeSource = (index: number) => {
    setResearchFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'research_paper': return <BookOpen className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
      showToast('Source added to entry!', 'success');
    } else {
      showToast('Please fill in source title and URL.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto animate-fade-in">
          <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin-slow" />
          <h3 className="text-2xl font-bold text-gray-900">Admin Access</h3>
          <p className="text-gray-600">Enter password to access admin panel</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Login
          </button>
        </form>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600 animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Admin Panel</h3>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg animate-fade-in-up">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Social Stats
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'research'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Research Entry
            </button>
            <button
              onClick={() => setActiveTab('corrections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'corrections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Correction
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Social Stats Tab */}
          {activeTab === 'stats' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Videos
                  </label>
                  <input
                    type="number"
                    value={formData.videos}
                    onChange={(e) => setFormData(prev => ({ ...prev, videos: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="150"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Followers
                  </label>
                  <input
                    type="number"
                    value={formData.followers}
                    onChange={(e) => setFormData(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Views
                  </label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="2000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Likes
                  </label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Last Updated:</strong> {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
                </p>
                <p className="text-xs text-gray-500">
                  These stats will be displayed in real-time on your homepage hero section.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Update Stats</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Research Entry Tab */}
          {activeTab === 'research' && (
            <form onSubmit={handleResearchSubmit} className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Number
                  </label>
                  <input
                    type="text"
                    required
                    value={researchFormData.contentNumber}
                    onChange={(e) => setResearchFormData(prev => ({ ...prev, contentNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., YT001, FB002"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={researchFormData.platform}
                    onChange={(e) => setResearchFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={researchFormData.title}
                  onChange={(e) => setResearchFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={researchFormData.description}
                  onChange={(e) => setResearchFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Brief description of the content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={researchFormData.tags}
                  onChange={(e) => setResearchFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="space, astronomy, science"
                />
              </div>

              {/* Sources Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sources</h4>
                
                {/* Add Source Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Source title"
                      value={newSource.title}
                      onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                      type="url"
                      placeholder="Source URL"
                      value={newSource.url}
                      onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <select
                      value={newSource.type}
                      onChange={(e) => setNewSource(prev => ({ ...prev, type: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="article">Article</option>
                      <option value="research_paper">Research Paper</option>
                      <option value="website">Website</option>
                      <option value="book">Book</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                    
                    <select
                      value={newSource.credibility}
                      onChange={(e) => setNewSource(prev => ({ ...prev, credibility: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="high">High Credibility</option>
                      <option value="medium">Medium Credibility</option>
                      <option value="low">Low Credibility</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <textarea
                      placeholder="Notes about this source (optional)"
                      value={newSource.notes}
                      onChange={(e) => setNewSource(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={addSource}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Add Source
                  </button>
                </div>

                {/* Sources List */}
                {researchFormData.sources.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {researchFormData.sources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border animate-slide-in-left hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-3">
                          {getSourceIcon(source.type)}
                          <div>
                            <p className="font-medium text-gray-900">{source.title}</p>
                            <p className="text-sm text-gray-500">{source.url}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSource(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300 hover:scale-110"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Research Entry</span>
              </button>
            </form>
          )}

          {/* Corrections Tab */}
          {activeTab === 'corrections' && (
            <form onSubmit={handleCorrectionSubmit} className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Number
                  </label>
                  <input
                    type="text"
                    required
                    value={correctionFormData.contentNumber}
                    onChange={(e) => setCorrectionFormData(prev => ({ ...prev, contentNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., YT001, FB002"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={correctionFormData.platform}
                    onChange={(e) => setCorrectionFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Title
                </label>
                <input
                  type="text"
                  required
                  value={correctionFormData.title}
                  onChange={(e) => setCorrectionFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="Title of the content with the mistake"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={correctionFormData.severity}
                    onChange={(e) => setCorrectionFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="major">Major</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={correctionFormData.status}
                    onChange={(e) => setCorrectionFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="corrected">Corrected</option>
                    <option value="acknowledged">Acknowledged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mistake Description
                </label>
                <textarea
                  required
                  value={correctionFormData.mistakeDescription}
                  onChange={(e) => setCorrectionFormData(prev => ({ ...prev, mistakeDescription: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="Describe what was incorrect in the original content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correction
                </label>
                <textarea
                  required
                  value={correctionFormData.correction}
                  onChange={(e) => setCorrectionFormData(prev => ({ ...prev, correction: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="Provide the correct information..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Add Correction</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}