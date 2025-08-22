import React, { useState } from 'react';
import { X, Upload, Link, FileText, Loader2 } from 'lucide-react';
import { Source } from '../types';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourceAdded: (source: Source) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function AddSourceModal({ isOpen, onClose, onSourceAdded, onSuccess, onError }: AddSourceModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'text'>('upload');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title.trim()) {
        setTitle(selectedFile.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onError('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (activeTab === 'url' && url.trim()) {
        response = await fetch('http://localhost:5000/api/url/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: title.trim(), url }),
        });
      } else if (activeTab === 'text' && text.trim()) {
        response = await fetch('http://localhost:5000/api/content/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: title.trim(), content: text }),
        });
      } else if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title.trim());

        response = await fetch('http://localhost:5000/api/file/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        onError('Please provide all required information');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      const source: Source = {
        id: data.id || Date.now().toString(),
        title: title.trim(),
        type: activeTab === 'upload' ? 'PDF' : activeTab === 'url' ? 'URL' : 'Text',
        content: activeTab === 'url' ? url : activeTab === 'text' ? text : file?.name || '',
        createdAt: new Date().toISOString()
      };

      onSourceAdded(source);
      onSuccess('Source uploaded successfully!');

      // Reset form
      setUrl('');
      setText('');
      setTitle('');
      setFile(null);
      onClose();
    } catch (error: any) {
      onError(error.message || 'Failed to upload source');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Source</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-4 h-4 mb-1" />
              <span>Upload</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'url' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
          >
            <div className="flex flex-col items-center">
              <Link className="w-4 h-4 mb-1" />
              <span>URL</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'text' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
          >
            <div className="flex flex-col items-center">
              <FileText className="w-4 h-4 mb-1" />
              <span>Text</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter a title for this source (required)"
              required
            />
          </div>

          {activeTab === 'upload' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload PDF File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${file ? 'border-blue-500 bg-blue-50/5' : 'border-gray-600 hover:border-gray-500'
                  }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">
                  {file ? file.name : 'Drag and drop PDF files here'}
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>

                {/* Invisible input covering only the container */}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>
          )}


          {activeTab === 'url' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          {activeTab === 'text' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Content *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 h-32 resize-none"
                placeholder="Paste your text content here..."
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !title.trim() ||
                (activeTab === 'upload' && !file) ||
                (activeTab === 'url' && !url.trim()) ||
                (activeTab === 'text' && !text.trim())}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Add Source</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}