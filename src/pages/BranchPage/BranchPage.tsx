import React from 'react';
import { ChatsList } from '../../components/@Branch/ChatsList';
import './BranchPage.scss';

export const BranchPage: React.FC = () => {
  return (
    <div className="branch-page">
      <h2 className="branch-page__title">Gestión de Chats</h2>
      <ChatsList />
    </div>
  );
}; 