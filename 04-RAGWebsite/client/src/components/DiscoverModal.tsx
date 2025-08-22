import React, { useState } from 'react';
import { X, Search, Globe, BookOpen, FileText } from 'lucide-react';
import { Source } from '../types';

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourceAdded: (source: Source) => void;
}

const suggestedSources = [
  {
    title: "Wikipedia",
    description: "Free encyclopedia with millions of articles",
    icon: Globe,
    url: "https://en.wikipedia.org"
  },
  {
    title: "Stack Overflow",
    description: "Programming Q&A community",
    icon: BookOpen,
    url: "https://stackoverflow.com"
  },
  {
    title: "GitHub Documentation",
    description: "Developer documentation and guides",
    icon: FileText,
    url: "https://docs.github.com"
  }
];

export default function DiscoverModal({ isOpen, onClose, onSourceAdded }: DiscoverModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleAddSource = (suggestedSource: typeof suggestedSources[0]) => {
    const source: Source = {
      id: Date.now().toString(),
      title: suggestedSource.title,
      type: 'URL',
      content: suggestedSource.url,
      createdAt: new Date().toISOString()
    };
    
    onSourceAdded(source);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Discover Sources</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Search for sources..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Suggested Sources</h3>
          
          {suggestedSources.map((source, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <source.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{source.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{source.description}</p>
                  <button
                    onClick={() => handleAddSource(source)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Add Source
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}