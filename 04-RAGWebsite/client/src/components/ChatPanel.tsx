import React, { useState, useEffect, useRef } from 'react';
import { Upload, Send, Sparkles, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  onUploadClick: () => void;
  hasContent: boolean;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  canChat: boolean;
  remainingQuestions: number;
  isLoading: boolean;
  currentUserMessage?: string;
}

export default function ChatPanel({ 
  onUploadClick, 
  hasContent, 
  messages, 
  onSendMessage, 
  canChat, 
  remainingQuestions,
  isLoading,
  currentUserMessage
}: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentUserMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canChat || isLoading) return;
    
    const currentMessage = message;
    setMessage('');
    await onSendMessage(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-gray-400">Ready to help with your sources</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-white text-2xl font-semibold mb-4">Add a source to get started</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Upload documents, PDFs, or other sources to start having intelligent conversations about your content.
            </p>
            <button 
              onClick={onUploadClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Upload a source
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Welcome message when sources are available but no chat yet */}
            {messages.length === 0 && hasContent && !currentUserMessage && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-4xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-2xl px-6 py-4 shadow-lg border border-gray-700/50">
                      <p className="text-sm leading-relaxed">
                        Hello! I'm your AI assistant. I can help you with questions about your uploaded sources. What would you like to know?
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {/* User message */}
                <div className="flex justify-end mb-4">
                  <div className="flex space-x-3 max-w-2xl flex-row-reverse space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl px-6 py-4 shadow-lg">
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* AI response */}
                <div className="flex justify-start mb-6">
                  <div className="flex space-x-3 max-w-4xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-2xl px-6 py-4 shadow-lg border border-gray-700/50">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                              <h1 className="text-xl font-bold text-white mb-3" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 className="text-lg font-semibold text-white mb-2" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-md font-medium text-white mb-2" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-sm leading-relaxed" {...props} />
                            ),
                            code: (props) => {
                              // @ts-expect-error: 'inline' is provided by react-markdown for code blocks
                              const { inline, ...rest } = props;
                              return inline ? (
                                <code className="bg-gray-700 text-blue-300 px-2 py-1 rounded text-sm font-mono" {...rest} />
                              ) : (
                                <code className="block bg-gray-900 text-gray-200 p-4 rounded-lg mt-2 text-sm overflow-x-auto font-mono border border-gray-700" {...rest} />
                              );
                            },
                            pre: ({ node, ...props }) => (
                              <pre className="bg-gray-900 p-4 rounded-lg mt-2 overflow-x-auto border border-gray-700" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-3 bg-gray-800/50 py-2 rounded-r" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="text-white font-semibold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="text-gray-200 italic" {...props} />
                            ),
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-3">
                                <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden" {...props} />
                              </div>
                            ),
                            th: ({ node, ...props }) => (
                              <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-white font-medium text-left" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="border border-gray-600 px-4 py-2 text-gray-200" {...props} />
                            ),
                          }}
                        >
                          {msg.response}
                        </ReactMarkdown>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Current user message being processed */}
            {currentUserMessage && (
              <>
                {/* User message */}
                <div className="flex justify-end mb-4">
                  <div className="flex space-x-3 max-w-2xl flex-row-reverse space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl px-6 py-4 shadow-lg">
                        <p className="text-sm leading-relaxed">{currentUserMessage}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* AI loading response */}
                <div className="flex justify-start mb-6">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-700/50">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasContent ? "Ask a question about your sources..." : "Upload a source to get started"}
              className={`w-full bg-gray-900 border rounded-2xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none transition-all duration-200 ${
                hasContent && canChat
                  ? 'border-gray-600 focus:border-blue-500' 
                  : 'border-gray-700 cursor-not-allowed opacity-60'
              }`}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={!hasContent || !canChat || isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-400 bg-gray-800 px-3 py-3 rounded-2xl border border-gray-700 h-12 flex items-center">
              {remainingQuestions} questions left
            </div>
            <button 
              type="submit"
              onClick={handleSubmit}
              className={`p-3 rounded-2xl transition-all duration-200 h-12 w-12 flex items-center justify-center ${
                hasContent && message.trim() && canChat && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
              disabled={!hasContent || !message.trim() || !canChat || isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 text-xs mt-3 text-center">
          MindVault AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}