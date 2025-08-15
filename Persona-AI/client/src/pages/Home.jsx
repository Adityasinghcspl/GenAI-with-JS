import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Sparkles, MessageCircle, Star } from 'lucide-react';
import aiBuddies from '../utils/aiBuddies';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Buddies
          </h1>
        </motion.div>
        
        <motion.a
          href="https://www.linkedin.com/in/aditya-singh-rathour-6405a0204/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
        >
          <Linkedin className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
        </motion.a>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Meet Your AI
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Buddies
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Chat with expert AI tutors who can help you learn programming, 
            advance your career, and build amazing projects.
          </p>
        </motion.div>

        {/* AI Buddies Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {aiBuddies.map((buddy, index) => (
            <motion.div
              key={buddy.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link to={`/chat/${buddy.id}`}>
                <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  {/* Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${buddy.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Avatar and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          src={buddy.avatar}
                          alt={buddy.name}
                          className="w-16 h-16 rounded-full border-3 border-gray-600 group-hover:border-gray-500 transition-colors duration-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-bold text-white mb-1">{buddy.name}</h3>
                    <p className={`text-sm font-medium mb-3 bg-gradient-to-r ${buddy.gradient} bg-clip-text text-transparent`}>
                      {buddy.title}
                    </p>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {buddy.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {buddy.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Chat Button */}
                    <div className={`flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r ${buddy.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200`}>
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Start Chatting</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Instant Responses</h3>
              <p className="text-gray-400 text-sm">Get immediate answers to your coding questions</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Expert Knowledge</h3>
              <p className="text-gray-400 text-sm">Learn from industry experts and educators</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Personalized Learning</h3>
              <p className="text-gray-400 text-sm">Tailored guidance for your learning journey</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;