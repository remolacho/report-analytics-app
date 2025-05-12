import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatBox } from '../../components/@Analytics';
import './ChatPage.scss';

export const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <div className="chat-page">
      <ChatBox chatId={chatId} />
    </div>
  );
}; 