import { API_URL } from '../../../config/constants';

interface DestroyResponse {
  success: boolean;
  message?: string;
}

export const destroyChat = async (chatId: string): Promise<DestroyResponse> => {
  try {
    const response = await fetch(`${API_URL}/v1/chats/destroy/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error('Error deleting chat:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}; 