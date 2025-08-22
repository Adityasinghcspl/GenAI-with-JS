import React from 'react';
import { Plus, FileText, CheckSquare, Square, Trash2 } from 'lucide-react';
import { Source } from '../types';

interface SourcesPanelProps {
  onAddClick: () => void;
  sources: Source[];
  selectedSources: string[];
  onSourceSelect: (sourceId: string) => void;
  onSelectAll: () => void;
  onDeleteSource: (sourceId: string) => void;
  onDeleteAll: () => void;
}

export default function SourcesPanel({ 
  onAddClick, 
  sources, 
  selectedSources, 
  onSourceSelect, 
  onSelectAll,
  onDeleteSource,
  onDeleteAll
}: SourcesPanelProps) {
  const allSelected = sources.length > 0 && selectedSources.length === sources.length;
  
  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Sources</h2>
        <div className="space-y-2">
          <button
            onClick={onAddClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Source</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {sources.length > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={onSelectAll}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
              </button>
              <button
                onClick={onDeleteAll}
                className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            </div>
          </div>
        )}
        
        {sources.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No sources added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <div 
                key={source.id} 
                className={`bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer border-2 ${
                  selectedSources.includes(source.id) 
                    ? 'border-blue-500 bg-gray-600' 
                    : 'border-transparent'
                }`}
                onClick={() => onSourceSelect(source.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {selectedSources.includes(source.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{source.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{source.type}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(source.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSource(source.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}