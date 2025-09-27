import React from 'react';
import { Play, Users, Eye, Heart } from 'lucide-react';
import { useFirestoreDocument } from '../hooks/useFirestore';
import { SocialStats } from '../types';

export default function Hero() {
  const { data: stats, loading } = useFirestoreDocument<SocialStats>('stats', 'social-stats');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Exploring the
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                {' '}Universe
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>& Beyond
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up delay-200">
              Welcome to my transparent content creation journey. Here you'll find all my research, 
              sources, and corrections for every video and reel I create across YouTube, Facebook, 
              Instagram, and TikTok.
            </p>
            <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up delay-300">
              <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Play className="h-5 w-5" />
                <span>Watch Latest</span>
              </button>
              <button className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                View Research
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-500">
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Play className="h-6 w-6 text-blue-400 group-hover:animate-bounce" />
                </div>
                <div className="text-2xl font-bold animate-count-up">
                  {loading ? '...' : formatNumber(stats?.videos || 0)}
                </div>
                <div className="text-sm text-gray-400">Videos</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-green-400 group-hover:animate-bounce" />
                </div>
                <div className="text-2xl font-bold animate-count-up">
                  {loading ? '...' : formatNumber(stats?.followers || 0)}
                </div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-6 w-6 text-purple-400 group-hover:animate-bounce" />
                </div>
                <div className="text-2xl font-bold animate-count-up">
                  {loading ? '...' : formatNumber(stats?.views || 0)}
                </div>
                <div className="text-sm text-gray-400">Views</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-6 w-6 text-red-400 group-hover:animate-bounce" />
                </div>
                <div className="text-2xl font-bold animate-count-up">
                  {loading ? '...' : formatNumber(stats?.likes || 0)}
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in-right">
            <div className="relative z-10">
              <img 
                src="/Photo.jpeg" 
                alt="Content Creator" 
                className="rounded-2xl shadow-2xl w-full max-w-[200px] sm:max-w-[250px] mx-auto hover:scale-105 transition-transform duration-500 animate-float"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl transform scale-110 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}