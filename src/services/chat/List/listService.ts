import { API_URL } from '../../../config/constants';

interface ChatResponse {
  id: number;
  reference: string;
  token: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  next_page: number | null;
  prev_page: number | null;
}

interface ListResponse {
  success: boolean;
  data: ChatResponse[];
  paginate: PaginationData;
  message?: string;
}

/**
 * Fetches the list of chats from the API
 * @param page - Page number for pagination (optional, defaults to 1)
 * @param signal - AbortSignal for cancellation (optional)
 * @returns Promise with the list of chats and pagination data
 */
export const listChats = (page: number = 1, signal?: AbortSignal): Promise<ListResponse> => {
  return fetch(`${API_URL}/v1/chats/list?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    signal
  })
    .then((response) => {
      return response.json();
    })
    .then((result: ListResponse) => {
      console.log(result);
      return {
        ...result,
        success: true
      };
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        // Ignoramos errores de abort ya que son esperados
        throw error;
      }
      console.error('Error fetching chats:', error);
      return {
        success: false,
        message: "Error en el servidor",
        data: [],
        paginate: {
          current_page: 0,
          total_pages: 0,
          total_count: 0,
          next_page: null,
          prev_page: null
        }
      };
    });
}; 