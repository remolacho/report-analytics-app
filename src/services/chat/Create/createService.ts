import { API_URL } from '../../../config/constants';

interface CreateChatResponse {
  success: boolean;
  data: {
    id: number;
    reference: string;
    token: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface CreateChatRequest {
  chat: {
    reference: string;
  };
}

export const createChat = async (reference: string): Promise<CreateChatResponse> => {
  const data: CreateChatRequest = {
    chat: { reference }
  };

  const response = await fetch(`${API_URL}/v1/chats/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error creating chat');
  }

  return response.json();
}; 