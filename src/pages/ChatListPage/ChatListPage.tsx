import React from 'react';
import { ChatsList } from '../../components/ChatsList';
import './ChatListPage.scss';

export const ChatListPage: React.FC = () => {
  return (
    <div className="chat-list-page">
      <h2 className="chat-list-page__title">Gestión de Chats</h2>
      <ChatsList />
    </div>
  );
}; 