import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { NewChatButton } from './components/NewChatButton';
import { Table, Chat } from './components/Table';
import { Pagination } from './components/Pagination';
import { listChats } from '../../services/chat/List/listService';
import { destroyChat } from '../../services/chat/Destroy/destroyService';
import './ChatsList.scss';

export const ChatsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chats, setChats] = useState<Chat[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const initialMount = useRef(true);

  const fetchChats = useCallback((page: number) => {
    setLoading(true);
    setError(null);

    listChats(page)
      .then((response) => {
        if (response.success) {
          const transformedChats: Chat[] = response.data.map(chat => ({
            uid: chat.id.toString(),
            reference: chat.reference,
            createdAt: new Date(chat.created_at)
          }));
          
          setChats(transformedChats);
          setTotalPages(response.paginate.total_pages);
        } else {
          setError(response.message || 'Error al cargar los chats');
        }
      })
      .catch((error) => {
        setError('Error al conectar con el servidor');
        console.error('Error fetching chats:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      fetchChats(currentPage);
    } else if (!initialMount.current && currentPage > 1) {
      // Solo hacer fetch en cambios de página después del montaje inicial
      fetchChats(currentPage);
    }
  }, [currentPage, fetchChats]);

  const filteredChats = chats.filter(chat =>
    chat.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (uid: string) => {
    try {
      setDeleteError(null); // Clear any previous delete error
      const response = await destroyChat(uid);
      if (response.success) {
        // Remove the chat from the local state
        setChats(prevChats => prevChats.filter(chat => chat.uid !== uid));
      } else {
        setDeleteError(response.message || 'Error al eliminar el chat');
      }
    } catch (error) {
      setDeleteError('Error al eliminar el chat. Por favor, inténtelo de nuevo.');
      console.error('Error deleting chat:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="chats-list__loading">Cargando...</div>;
  }

  if (error) {
    return <div className="chats-list__error">{error}</div>;
  }

  return (
    <div className="chats-list">
      {deleteError && (
        <div className="chats-list__delete-error">
          {deleteError}
        </div>
      )}
      <div className="chats-list__header">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <NewChatButton />
      </div>

      <Table 
        chats={filteredChats}
        onDelete={handleDelete}
      />

      <div className="chats-list__footer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}; 