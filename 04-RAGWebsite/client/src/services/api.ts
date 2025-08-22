const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return { data: await response.json() };
  }
}

const api = new ApiService();

export const sendChatMessage = async (message: string) => {
  const response = await api.post('/chat', { message });
  return response.data;
};