import React, { useState, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { NewChatButton } from './components/NewChatButton';
import { Table, Chat } from './components/Table';
import { Pagination } from './components/Pagination';
import './ChatsList.scss';

// Data dummy para pruebas
const DUMMY_DATA: Chat[] = [
  { uid: 'CH001', createdAt: new Date('2024-03-01'), reference: 'Análisis Ventas Q1' },
  { uid: 'CH002', createdAt: new Date('2024-03-02'), reference: 'Reporte Mensual' },
  { uid: 'CH003', createdAt: new Date('2024-03-03'), reference: 'KPIs Marketing' },
  { uid: 'CH004', createdAt: new Date('2024-03-04'), reference: 'Métricas Usuario' },
  { uid: 'CH005', createdAt: new Date('2024-03-05'), reference: 'Dashboard Principal' },
];

const ITEMS_PER_PAGE = 4;

export const ChatsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredChats = useMemo(() => {
    return DUMMY_DATA.filter(chat =>
      chat.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredChats.length / ITEMS_PER_PAGE);

  const currentChats = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredChats.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredChats, currentPage]);

  const handleDelete = (uid: string) => {
    console.log(`Chat ${uid} eliminado`);
  };

  return (
    <div className="chats-list">
      <div className="chats-list__header">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <NewChatButton />
      </div>

      <Table 
        chats={currentChats}
        onDelete={handleDelete}
      />

      <div className="chats-list__footer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}; 