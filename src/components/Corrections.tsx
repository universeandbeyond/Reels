import React, { useState } from 'react';
import { AlertTriangle, Plus, Calendar, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Correction } from '../types';

export default function Corrections() {
  const { data: corrections, loading, addItem: addCorrection } = useFirestoreCollection<Correction>('corrections');

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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Corrections & Updates</h2>
          <p className="text-xl text-gray-600">
            Transparency in acknowledging and correcting mistakes
          </p>
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading corrections...</p>
            </div>
          ) : corrections.map((correction) => (
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
          !loading && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No corrections needed</h3>
            <p className="text-gray-600">
              Great! No mistakes have been identified in the content so far. 
              This section will show any corrections when they're needed.
            </p>
          </div>
          )
        )}

      </div>
    </section>
  );
}