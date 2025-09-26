import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useFirestoreDocument } from '../hooks/useFirestore';
import { SocialStats } from '../types';

export default function AdminPanel() {
  const { data: stats, loading, updateDocument } = useFirestoreDocument<SocialStats>('stats', 'social-stats');
  const [formData, setFormData] = useState({
    videos: stats?.videos || 0,
    followers: stats?.followers || 0,
    views: stats?.views || 0,
    likes: stats?.likes || 0
  });
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDocument({
        ...formData,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Update Social Stats</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Videos
            </label>
            <input
              type="number"
              value={formData.videos}
              onChange={(e) => setFormData(prev => ({ ...prev, videos: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
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
    </div>
  );
}