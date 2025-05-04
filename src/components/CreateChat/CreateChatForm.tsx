import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import './CreateChatForm.scss';

interface CreateChatFormProps {
  onClose: () => void;
}

export const CreateChatForm: React.FC<CreateChatFormProps> = ({ onClose }) => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      onClose();
      navigate('/chat-analytic');
    } catch (error) {
      console.error('Error al crear el chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="create-chat-form" onSubmit={handleSubmit}>
      <div className="create-chat-form__field">
        <label htmlFor="reference">Referencia</label>
        <input
          id="reference"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ingrese una referencia para el chat"
          required
          disabled={isLoading}
        />
      </div>

      <div className="create-chat-form__actions">
        <button 
          type="button" 
          className="create-chat-form__button create-chat-form__button--secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="create-chat-form__button create-chat-form__button--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="create-chat-form__spinner" />
              Creando...
            </>
          ) : (
            'Crear Chat'
          )}
        </button>
      </div>
    </form>
  );
}; 