// Main API exports
export { default as apiClient } from './client';
export { default as API_CONFIG } from './config';

// Error handling utilities
export {
  APIError,
  NetworkError,
  ValidationError,
  handleAPIError,
  handleAPIResponse,
  retryRequest,
} from './errorHandler';

// Services
export { default as chatService } from './services/chatService';
// export { default as buddyService } from './services/buddyService';
// export { default as userService } from './services/userService';

// Convenience methods for common operations
export const api = {
  // Chat operations
  sendMessage: (buddyId, message, conversationId) => 
    chatService.sendMessage(buddyId, message, conversationId),
  
  getConversationHistory: (conversationId) => 
    chatService.getConversationHistory(conversationId),
  
  createConversation: (buddyId) => 
    chatService.createConversation(buddyId),
  
  // Buddy operations
  // getAllBuddies: () => 
  //   buddyService.getAllBuddies(),
  
  // getBuddyById: (buddyId) => 
  //   buddyService.getBuddyById(buddyId),
  
  // User operations
  // login: (email, password) => 
  //   userService.login(email, password),
  
  // register: (userData) => 
  //   userService.register(userData),
  
  // logout: () => 
  //   userService.logout(),
  
  // getProfile: () => 
  //   userService.getProfile(),
};