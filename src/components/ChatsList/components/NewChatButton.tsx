import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Modal, CreateChatForm } from '../../CreateChat';

export const NewChatButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="new-chat-button"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus className="new-chat-button__icon" />
        Nuevo Chat
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Chat"
      >
        <CreateChatForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}; 