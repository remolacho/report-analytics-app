import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

export const NewChatButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="new-chat-button"
      onClick={() => navigate('/chat')}
    >
      <FaPlus className="new-chat-button__icon" />
      Nuevo Chat
    </button>
  );
}; 