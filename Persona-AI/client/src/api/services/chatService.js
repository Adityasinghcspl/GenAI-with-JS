import apiClient from '../client';
import { handleAPIError, handleAPIResponse, retryRequest } from '../errorHandler';

class ChatService {
  // Send message to AI buddy
  async sendMessage(buddyId, message) {
    try {
      const requestFn = () => apiClient.post(`/${buddyId}`, {
        message,
      });

      const response = await retryRequest(requestFn);
      return handleAPIResponse(response);
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId) {
    try {
      const response = await apiClient.get(`/chat/conversation/${conversationId}`);
      return handleAPIResponse(response);
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Create new conversation
  async createConversation(buddyId) {
    try {
      const response = await apiClient.post('/chat/conversation', {
        buddyId,
      });
      return handleAPIResponse(response);
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Get user's conversations
  async getUserConversations() {
    try {
      const response = await apiClient.get('/chat/conversations');
      return handleAPIResponse(response);
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Delete conversation
  async deleteConversation(conversationId) {
    try {
      const response = await apiClient.delete(`/chat/conversation/${conversationId}`);
      return handleAPIResponse(response);
    } catch (error) {
      handleAPIError(error);
    }
  }
}

export default new ChatService();