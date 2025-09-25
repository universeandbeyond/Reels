import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ContentGrid from './components/ContentGrid';
import ResearchVault from './components/ResearchVault';
import Corrections from './components/Corrections';
import Contact from './components/Contact';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ResearchEntry, Correction } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [researchEntries, setResearchEntries] = useLocalStorage<ResearchEntry[]>('researchEntries', []);
  const [corrections, setCorrections] = useLocalStorage<Correction[]>('corrections', []);

  const addResearchEntry = (entry: Omit<ResearchEntry, 'id'>) => {
    const newEntry: ResearchEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setResearchEntries(prev => [newEntry, ...prev]);
  };

  const addCorrection = (correction: Omit<Correction, 'id'>) => {
    const newCorrection: Correction = {
      ...correction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setCorrections(prev => [newCorrection, ...prev]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero />
            <About />
          </>
        );
      case 'about':
        return <About />;
      case 'content':
        return <ContentGrid entries={researchEntries} />;
      case 'research':
        return <ResearchVault entries={researchEntries} onAddEntry={addResearchEntry} />;
      case 'corrections':
        return <Corrections corrections={corrections} onAddCorrection={addCorrection} />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero />
            <About />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {renderSection()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/Logo.jpeg" 
                  alt="Universe & Beyond" 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">Universe & Beyond</h3>
                  <p className="text-gray-400 text-sm">Explore the Infinite</p>
                </div>
              </div>
              <p className="text-gray-400">
                Committed to transparent, research-driven content creation 
                across all platforms.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveSection('research')} className="hover:text-white transition-colors">Research Vault</button></li>
                <li><button onClick={() => setActiveSection('corrections')} className="hover:text-white transition-colors">Corrections</button></li>
                <li><button onClick={() => setActiveSection('content')} className="hover:text-white transition-colors">Content</button></li>
                <li><button onClick={() => setActiveSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Transparency Stats</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{researchEntries.length} Research Entries</li>
                <li>{researchEntries.reduce((acc, entry) => acc + entry.sources.length, 0)} Total Sources</li>
                <li>{corrections.length} Corrections Made</li>
                <li>100% Transparency</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Universe & Beyond. All rights reserved. Built with transparency in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
