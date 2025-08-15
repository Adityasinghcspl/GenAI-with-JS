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
}

export default new ChatService();