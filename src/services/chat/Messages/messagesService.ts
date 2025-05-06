import { API_URL } from '../../../config/constants';

interface ChatData {
  id: number;
  reference: string;
  token: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Message {
  action: 'text' | 'preview';
  role: 'user' | 'assistant';
  message: string;
  has_file: boolean;
  filename: string | null;
  extension: 'xlsx' | 'csv' | 'json' | null;
  timestamp: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  next_page: number | null;
  prev_page: number | null;
}

interface MessagesResponse {
  success: boolean;
  data: {
    chat: ChatData;
    messages: Message[];
    pagination: PaginationData;
  };
  message?: string;
}

/**
 * Fetches messages for a specific chat from the API
 * @param chatId - ID of the chat to fetch messages from
 * @param page - Page number for pagination (optional, defaults to 1)
 * @param signal - AbortSignal for cancellation (optional)
 * @returns Promise with chat data, messages and pagination information
 */
export const getMessages = (
  chatId: string | number,
  page: number = 1,
  signal?: AbortSignal
): Promise<MessagesResponse> => {
  return fetch(`${API_URL}/v1/chats/show/${chatId}?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    signal
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result: MessagesResponse) => {
      return {
        ...result,
        success: true
      };
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.error('Error fetching messages:', error);
      return {
        success: false,
        message: "Error en el servidor",
        data: {
          chat: {
            id: 0,
            reference: '',
            token: '',
            active: false,
            created_at: '',
            updated_at: ''
          },
          messages: [],
          pagination: {
            current_page: 0,
            total_pages: 0,
            total_count: 0,
            next_page: null,
            prev_page: null
          }
        }
      };
    });
}; 