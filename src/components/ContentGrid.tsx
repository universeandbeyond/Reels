import React from 'react';
import { Youtube, Facebook, Instagram, Video, ExternalLink, Calendar, Tag } from 'lucide-react';
import { ResearchEntry } from '../types';

interface ContentGridProps {
  entries: ResearchEntry[];
}

export default function ContentGrid({ entries }: ContentGridProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />;
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'tiktok': return <Video className="h-5 w-5 text-gray-900" />;
      default: return <Video className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'tiktok': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Content</h2>
          <p className="text-xl text-gray-600">
            Explore my latest videos and reels across all platforms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(entry.platform)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(entry.platform)}`}>
                      {entry.platform.charAt(0).toUpperCase() + entry.platform.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">#{entry.contentNumber}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {entry.title}
                </h3>

                {entry.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {entry.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(entry.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>{entry.sources.length} sources</span>
                  </div>
                </div>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">+{entry.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Research
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Watch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600">Content entries will appear here once added to the research vault.</p>
          </div>
        )}
      </div>
    </section>
  );
}