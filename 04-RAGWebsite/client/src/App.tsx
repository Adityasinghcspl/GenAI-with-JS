import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import SourcesPanel from './components/SourcesPanel';
import ChatPanel from './components/ChatPanel';
import AddSourceModal from './components/AddSourceModal';
import DiscoverModal from './components/DiscoverModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useChatLimit } from './hooks/useChatLimit';
import { sendChatMessage } from './services/api';
import { Source } from './types';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState(false);
  const [sources, setSources] = useLocalStorage<Source[]>('sources', []);
  const [selectedSources, setSelectedSources] = useLocalStorage<string[]>('selectedSources', []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserMessage, setCurrentUserMessage] = useState<string>('');
  
  const {
    canChat,
    messages,
    remainingQuestions,
    timeUntilReset,
    incrementQuestionCount,
    addMessage,
  } = useChatLimit();

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleDiscoverClick = () => {
    setIsAddModalOpen(false);
    setIsDiscoverModalOpen(true);
  };

  const handleUploadClick = () => {
    setIsAddModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsDiscoverModalOpen(false);
  };

  const handleSourceAdded = (source: Source) => {
    setSources(prev => [...prev, source]);
    setSelectedSources(prev => [...prev, source.id]);
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(sources.map(source => source.id));
    }
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources(prev => prev.filter(source => source.id !== sourceId));
    setSelectedSources(prev => prev.filter(id => id !== sourceId));
    toast.success('Source deleted successfully');
  };

  const handleDeleteAll = () => {
    if (sources.length === 0) return;
    setSources([]);
    setSelectedSources([]);
    toast.success('All sources deleted successfully');
  };
  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  const handleSendMessage = async (message: string) => {
    if (!canChat) {
      const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
      toast.error(`Token limit reached! Please wait ${hours}h ${minutes}m before asking more questions.`);
      return;
    }

    setCurrentUserMessage(message);
    setIsLoading(true);
    try {
      const response = await sendChatMessage(message);
      // Fixed: API returns 'reply' not 'response'
      addMessage(message, response.reply || 'No response received');
      incrementQuestionCount();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
      setCurrentUserMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
          },
        }}
      />
      <Header title="My Knowledge Vault" />
      
      <div className="flex flex-1">
        <SourcesPanel 
          onAddClick={handleAddClick}
          sources={sources}
          selectedSources={selectedSources}
          onSourceSelect={handleSourceSelect}
          onSelectAll={handleSelectAll}
          onDeleteSource={handleDeleteSource}
          onDeleteAll={handleDeleteAll}
        />
        <ChatPanel 
          onUploadClick={handleUploadClick} 
          hasContent={sources.length > 0}
          messages={messages}
          onSendMessage={handleSendMessage}
          canChat={canChat}
          remainingQuestions={remainingQuestions}
          isLoading={isLoading}
          currentUserMessage={currentUserMessage}
        />
      </div>
      
      <AddSourceModal 
        isOpen={isAddModalOpen}
        onClose={closeModals}
        onSourceAdded={handleSourceAdded}
        onSuccess={handleSuccess}
        onError={handleError}
      />
      
      <DiscoverModal 
        isOpen={isDiscoverModalOpen}
        onClose={closeModals}
        onSourceAdded={handleSourceAdded}
      />
    </div>
  );
}

export default App;