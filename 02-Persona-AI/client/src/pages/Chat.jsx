import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Bot, User } from 'lucide-react';
import chatService from '../api/services/chatService';

const aiBuddies = {
  hitesh: {
    id: 'hitesh',
    name: 'Hitesh Choudhary',
    title: 'Tech Educator & Entrepreneur',
    avatar: 'https://github.com/hiteshchoudhary.png',
    specialties: ['JavaScript', 'Python', 'Web Development', 'DSA', 'AI'],
    gradient: 'from-blue-500 to-purple-600',
    welcomeMessage: "Hey there! I'm Hitesh. Let's dive into some coding magic together! What would you like to learn today?"
  },
  piyush: {
    id: 'piyush',
    name: 'Piyush Garg',
    title: 'Educator & Content Creator',
    avatar: 'https://github.com/piyushgarg-dev.png',
    specialties: ['Docker', 'React', 'Node.js', 'Gen AI', 'Career Advice'],
    gradient: 'from-green-500 to-teal-600',
    welcomeMessage: "Hello! I'm Piyush. Ready to explore the world of development and AI? Ask me anything!"
  }
};

const Chat = () => {
  const { buddyId } = useParams();
  const buddy = aiBuddies[buddyId];
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (buddy) {
      setMessages([{
        id: 1,
        text: buddy.welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [buddy]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the actual API
      const response = await chatService.sendMessage(buddyId, currentMessage);

      const aiResponse = {
        id: Date.now() + 1,
        text:
          response?.role === 'assistant'
            ? response.content || 'Sorry, I could not process your request.'
            : 'Sorry, I could not process your request.',
        sender: 'ai',
        timestamp: new Date()
      };
      console.log(response, "aiResponse==================");

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!buddy) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">AI Buddy not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4"
      >
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={buddy.avatar}
                alt={buddy.name}
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{buddy.name}</h1>
              <p className={`text-sm bg-gradient-to-r ${buddy.gradient} bg-clip-text text-transparent`}>
                {buddy.title}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : `bg-gradient-to-r ${buddy.gradient}`
                  }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 max-w-md ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                    }`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-sm leading-relaxed" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="ml-4 list-disc" {...props} />
                        )
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${buddy.gradient} flex items-center justify-center`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-4"
      >
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${buddy.name} anything...`}
              className="w-full bg-gray-900 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors duration-200"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-2xl transition-all duration-200 ${inputMessage.trim()
              ? `bg-gradient-to-r ${buddy.gradient} hover:opacity-90 transform hover:scale-105`
              : 'bg-gray-700 cursor-not-allowed'
              }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;