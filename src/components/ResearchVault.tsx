import React, { useState } from 'react';
import { Plus, Search, Filter, ExternalLink, BookOpen, Globe, FileText, Video, Star } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { ResearchEntry, Source } from '../types';

export default function ResearchVault() {
  const { data: entries, loading, addItem: addEntry } = useFirestoreCollection<ResearchEntry>('research-entries');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<ResearchEntry | null>(null);

  const [formData, setFormData] = useState({
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

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.contentNumber.includes(searchTerm);
    const matchesPlatform = filterPlatform === 'all' || entry.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      ...formData,
      sources: formData.sources.map(source => ({ ...source, id: Date.now().toString() + Math.random() })),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      uploadDate: new Date().toISOString()
    };
    addEntry(entry);
    setFormData({
      contentNumber: '',
      title: '',
      platform: 'youtube',
      contentType: 'video',
      description: '',
      tags: '',
      sources: []
    });
    setShowAddForm(false);
  };

  const addSource = () => {
    if (newSource.title && newSource.url) {
      setFormData(prev => ({
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
  };

  const removeSource = (index: number) => {
    setFormData(prev => ({
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
    }
  };

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Research Vault</h2>
            <p className="text-xl text-gray-600">
              Transparent documentation of all research and sources
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or content number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading research entries...</p>
            </div>
          ) : filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{entry.title}</h3>
                    <p className="text-sm text-gray-500">Content #{entry.contentNumber}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {entry.platform}
                  </span>
                </div>

                {entry.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{entry.description}</p>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Sources ({entry.sources.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {entry.sources.slice(0, 3).map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {getSourceIcon(source.type)}
                        <span className="flex-1 truncate">{source.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCredibilityColor(source.credibility)}`}>
                          {source.credibility}
                        </span>
                      </div>
                    ))}
                    {entry.sources.length > 3 && (
                      <p className="text-xs text-gray-500">+{entry.sources.length - 3} more sources</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(entry.uploadDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No research entries found</h3>
            <p className="text-gray-600">Start by adding your first research entry.</p>
          </div>
          )
        )}

        {/* Add Entry Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Add Research Entry</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contentNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., YT001, FB002"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Content title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="space, astronomy, science"
                  />
                </div>

                {/* Sources Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Sources</h4>
                  
                  {/* Add Source Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Source title"
                        value={newSource.title}
                        onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Source URL"
                        value={newSource.url}
                        onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <select
                        value={newSource.type}
                        onChange={(e) => setNewSource(prev => ({ ...prev, type: e.target.value as any }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={addSource}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add Source
                    </button>
                  </div>

                  {/* Sources List */}
                  {formData.sources.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
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
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Entry Details Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedEntry.title}</h3>
                    <p className="text-gray-600">Content #{selectedEntry.contentNumber} • {selectedEntry.platform}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {selectedEntry.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEntry.description}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sources ({selectedEntry.sources.length})</h4>
                  <div className="space-y-4">
                    {selectedEntry.sources.map((source, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(source.type)}
                            <h5 className="font-medium text-gray-900">{source.title}</h5>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(source.credibility)}`}>
                            {source.credibility}
                          </span>
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mb-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{source.url}</span>
                        </a>
                        {source.notes && (
                          <p className="text-gray-600 text-sm">{source.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEntry.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Upload Date: {new Date(selectedEntry.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}