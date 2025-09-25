import React from 'react';
import { Shield, Search, BookOpen, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every claim I make is backed by research. All sources are publicly available for verification.'
    },
    {
      icon: Search,
      title: 'Research-Driven',
      description: 'I spend hours researching each topic, consulting multiple credible sources before creating content.'
    },
    {
      icon: BookOpen,
      title: 'Educational Focus',
      description: 'My goal is to make complex topics accessible while maintaining scientific accuracy.'
    },
    {
      icon: Users,
      title: 'Community Accountability',
      description: 'I welcome corrections and feedback from my audience to ensure information accuracy.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About My Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I believe in responsible content creation. Every video, reel, and post I create is 
            thoroughly researched and fact-checked. This portfolio serves as a transparent 
            record of my work and sources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Transparency Matters</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  In an era of misinformation, content creators have a responsibility to their 
                  audience. I've built this platform to showcase not just my content, but the 
                  rigorous research process behind it.
                </p>
                <p>
                  Every video includes a detailed research vault entry with all sources, 
                  methodologies, and fact-checking processes. If I make a mistake, you'll 
                  find it documented in the corrections section along with the accurate information.
                </p>
                <p>
                  This level of transparency builds trust and helps elevate the standard 
                  of educational content across all platforms.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">My Commitment</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cite all sources used in content creation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Publicly acknowledge and correct any mistakes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain detailed research documentation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Engage with community feedback constructively</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}