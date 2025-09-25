import React, { useState } from 'react';
import { AlertTriangle, Plus, Calendar, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Correction } from '../types';

interface CorrectionsProps {
  corrections: Correction[];
  onAddCorrection: (correction: Omit<Correction, 'id'>) => void;
}

export default function Corrections({ corrections, onAddCorrection }: CorrectionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    contentNumber: '',
    title: '',
    platform: 'youtube' as const,
    mistakeDescription: '',
    correction: '',
    severity: 'minor' as const,
    status: 'pending' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correction: Omit<Correction, 'id'> = {
      ...formData,
      correctionDate: new Date().toISOString()
    };
    onAddCorrection(correction);
    setFormData({
      contentNumber: '',
      title: '',
      platform: 'youtube',
      mistakeDescription: '',
      correction: '',
      severity: 'minor',
      status: 'pending'
    });
    setShowAddForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'corrected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'acknowledged': return <XCircle className="h-5 w-5 text-blue-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'corrected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Corrections & Updates</h2>
            <p className="text-xl text-gray-600">
              Transparency in acknowledging and correcting mistakes
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Correction</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{corrections.length}</p>
                <p className="text-red-700 text-sm">Total Corrections</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {corrections.filter(c => c.status === 'corrected').length}
                </p>
                <p className="text-green-700 text-sm">Corrected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {corrections.filter(c => c.status === 'pending').length}
                </p>
                <p className="text-yellow-700 text-sm">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {corrections.filter(c => c.status === 'acknowledged').length}
                </p>
                <p className="text-blue-700 text-sm">Acknowledged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Corrections List */}
        <div className="space-y-6">
          {corrections.map((correction) => (
            <div key={correction.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{correction.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(correction.severity)}`}>
                      {correction.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">Content #{correction.contentNumber} • {correction.platform}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(correction.correctionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(correction.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(correction.status)}`}>
                    {correction.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Mistake Description</span>
                  </h4>
                  <p className="text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    {correction.mistakeDescription}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Correction</span>
                  </h4>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    {correction.correction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {corrections.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No corrections needed</h3>
            <p className="text-gray-600">
              Great! No mistakes have been identified in the content so far. 
              This section will show any corrections when they're needed.
            </p>
          </div>
        )}

        {/* Add Correction Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Add Correction</h3>
                <p className="text-gray-600 mt-1">Document a mistake and its correction</p>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Title of the content with the mistake"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    value={formData.mistakeDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, mistakeDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe what was incorrect in the original content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correction
                  </label>
                  <textarea
                    required
                    value={formData.correction}
                    onChange={(e) => setFormData(prev => ({ ...prev, correction: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Provide the correct information..."
                  />
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
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Add Correction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}