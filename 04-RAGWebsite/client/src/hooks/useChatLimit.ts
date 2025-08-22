import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ChatMessage } from '../types';

const QUESTIONS_PER_DAY = 10;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface ChatLimitState {
  questionCount: number;
  lastResetTime: number;
}

export function useChatLimit() {
  const [chatState, setChatState] = useLocalStorage<ChatLimitState>('chatLimit', {
    questionCount: 0,
    lastResetTime: Date.now()
  });
  
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chatMessages', []);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  // Check if we need to reset the counter
  useEffect(() => {
    const now = Date.now();
    const timeSinceReset = now - chatState.lastResetTime;
    
    if (timeSinceReset >= RESET_INTERVAL) {
      setChatState({
        questionCount: 0,
        lastResetTime: now
      });
    }
  }, [chatState.lastResetTime, setChatState]);

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const nextReset = chatState.lastResetTime + RESET_INTERVAL;
      setTimeUntilReset(Math.max(0, nextReset - now));
    };
    
    updateTimer(); // Initial update
    
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [chatState.lastResetTime]);

  const canChat = chatState.questionCount < QUESTIONS_PER_DAY;
  const remainingQuestions = Math.max(0, QUESTIONS_PER_DAY - chatState.questionCount);

  const incrementQuestionCount = () => {
    setChatState(prev => ({
      ...prev,
      questionCount: prev.questionCount + 1
    }));
  };

  const addMessage = (message: string, response: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      response,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  return {
    canChat,
    messages,
    remainingQuestions,
    timeUntilReset,
    incrementQuestionCount,
    addMessage
  };
}