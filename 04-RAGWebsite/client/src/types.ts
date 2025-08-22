export interface Source {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}