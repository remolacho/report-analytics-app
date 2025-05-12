import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { createChat } from '../../services/chat/Create/createService';
import './CreateChatForm.scss';

interface CreateChatFormProps {
  onClose: () => void;
}

export const CreateChatForm: React.FC<CreateChatFormProps> = ({ onClose }) => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await createChat(reference);
      if (response.success) {
        onClose();
        // Navegamos al chat con el ID creado
        navigate(`/chat-analytic/${response.data.id}`);
      } else {
        setError('Error al crear el chat');
      }
    } catch (error) {
      console.error('Error al crear el chat:', error);
      setError('Error al crear el chat. Por favor, intente nuevamente.');
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
        {error && <div className="create-chat-form__error">{error}</div>}
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