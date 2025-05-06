import { API_URL } from '../../../config/constants';

interface CreateMessageResponse {
  success: boolean;
  data: {
    action: 'text' | 'preview' | 'graph' | 'download';
    role: 'assistant' | 'user' | 'system';
    message: string;
    has_file: boolean;
    extension: string | null;
    source_code: string | null;
    timestamp: string;
  };
}

/**
 * Creates a new message in a chat
 * @param chatId - ID of the chat where the message will be created
 * @param message - Text content of the message
 * @param file - Optional file to be analyzed
 * @returns Promise with the created message data
 */
export const createMessage = async (
  chatId: string | number,
  message: string,
  file?: File
): Promise<CreateMessageResponse> => {
  const formData = new FormData();

  // Rails espera los parámetros anidados en chat_message
  formData.append('chat_message[chat_id]', chatId.toString());
  formData.append('chat_message[message]', message);
  
  if (file) {
    formData.append('chat_message[file]', file);
  }

  try {
    const response = await fetch(`${API_URL}/v1/chat_messages/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error creating message');
    }

    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}; 