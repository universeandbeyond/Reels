import React from 'react';
import { Menu, X, Youtube, Facebook, Instagram, Video } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'content', label: 'Content' },
    { id: 'research', label: 'Research Vault' },
    { id: 'corrections', label: 'Corrections' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/Logo.jpeg" 
              alt="Universe & Beyond" 
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Universe & Beyond</h1>
              <p className="text-sm text-gray-600">Content Creator Portfolio</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-red-600 hover:text-red-700">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-700">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-900 hover:text-gray-700">
              <Video className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-4 mt-4 px-3">
              <a href="#" className="text-red-600 hover:text-red-700">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700">
                <Video className="h-5 w-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}