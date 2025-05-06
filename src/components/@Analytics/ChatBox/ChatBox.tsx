import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../Message';
import { FileDropzone } from '../FileDropzone';
import { VegaRailsSpec } from '../../../types/vega';
import { getMessages } from '../../../services/chat/Messages/messagesService';
import { createMessage } from '../../../services/chat/CreateMessage/createMessage';
import './ChatBox.scss';

// Tipos de mensajes que puede manejar el chat
interface MessageData {
  type: 'text' | 'html' | 'graph' | 'download';
  content?: string;
  text?: string;
  url?: string;
  vegaSpec?: VegaRailsSpec;
  sender: 'user' | 'system';
  timestamp: number;
}

// Función para obtener el icono según la extensión del archivo
const getFileIcon = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop();
  switch (extension) {
    case 'xlsx':
    case 'xls':
      return '📊';
    case 'csv':
      return '📝';
    case 'json':
      return '📋';
    default:
      return '📄';
  }
};

// Función para obtener el nombre formateado del archivo
const getFormattedFileName = (file: File): string => {
  const extension = file.name.split('.').pop()?.toUpperCase() || '';
  return `${extension} - ${file.name}`;
};

interface ChatBoxProps {
  chatId?: string;
}

type MessageAction = 'text' | 'preview' | 'download' | 'graph';

export const ChatBox: React.FC<ChatBoxProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadMessages = async (pageNum: number) => {
    if (!chatId) return;
    
    setIsLoading(true);
    try {
      const response = await getMessages(chatId, pageNum);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar los mensajes');
      }

      // Mapear los mensajes manteniendo la estructura actual
      const newMessages = response.data.messages.map(msg => {
        const action = msg.action as MessageAction;
        let messageData: MessageData = {
          type: 'text',
          text: msg.message,
          sender: msg.role === 'assistant' ? 'system' : 'user',
          timestamp: new Date(msg.timestamp).getTime()
        };

        // Si el mensaje tiene un archivo adjunto, agregar el icono y nombre del archivo
        if (msg.has_file && msg.filename && msg.extension) {
          const fileIcon = getFileIcon(msg.filename);
          messageData.text = `${messageData.text} ${fileIcon} [${msg.filename}]`;
        }

        // Manejar diferentes tipos de mensajes
        switch (action) {
          case 'preview':
            messageData.type = 'html';
            messageData.content = msg.message;
            messageData.text = undefined;
            break;
          case 'download':
            messageData.type = 'download';
            messageData.url = msg.message;
            break;
          case 'graph':
            try {
              console.log('Mensaje:', msg.message);
              messageData.type = 'graph';
              const graphData = typeof msg.message === 'string' ? JSON.parse(msg.message) : msg.message;
              
              // Asegurarnos de que el objeto tiene la estructura correcta
              if (graphData && typeof graphData === 'object') {
                messageData.vegaSpec = {
                  schema: graphData.schema || "https://vega.github.io/schema/vega-lite/v5.json",
                  spec: graphData.spec || graphData // Si no tiene spec, asumimos que todo el objeto es la spec
                };
              } else {
                throw new Error('Formato de gráfico inválido');
              }
            } catch (error) {
              console.error('Error al procesar el mensaje:', error);
              console.log('Mensaje:', msg.message);
              messageData.type = 'text';
              messageData.text = 'Error: No se pudo procesar el mensaje como un gráfico.';
            }
            break;
          default:
            // 'text' es el valor por defecto, ya establecido
            break;
        }

        return messageData;
      });

      if (pageNum === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...newMessages, ...prev]); // Agregar mensajes antiguos arriba
      }

      setHasMore(response.data.pagination.next_page !== null);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Error al cargar los mensajes. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar mensajes iniciales
  useEffect(() => {
    if (chatId) {
      loadMessages(1);
    }
  }, [chatId]);

  // Mantener scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para cargar más mensajes
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      loadMessages(page + 1);
    }
  };

  // Maneja la subida de archivos
  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const validTypes = [
        'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];

      if (validTypes.includes(file.type) || 
          file.name.endsWith('.json') || 
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls') || 
          file.name.endsWith('.csv')) {
        setAttachedFile(file);
      } else {
        const errorMessage: MessageData = {
          type: 'text',
          text: 'Error: Solo se permiten archivos XLSX, XLS, CSV o JSON.',
          sender: 'system',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  // Elimina el archivo adjunto
  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // Función para ajustar la altura del textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  // Manejar cambios en el textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  // Manejar teclas especiales
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (inputMessage.trim() || attachedFile)) {
        handleSubmit(e);
      }
    }
  };

  // Ajustar altura inicial cuando cambia el mensaje
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  // Maneja el envío de mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || (!inputMessage.trim() && !attachedFile)) return;

    // Deshabilitar el formulario mientras se procesa
    setIsLoading(true);

    try {
      // Crear mensaje del usuario para el chat
      const userMessage: MessageData = {
        type: 'text',
        text: inputMessage.trim(),
        sender: 'user',
        timestamp: Date.now()
      };

      // Si hay un archivo adjunto, agregar la información del archivo al mensaje
      if (attachedFile) {
        const fileIcon = getFileIcon(attachedFile.name);
        userMessage.text = `${userMessage.text || ''} ${fileIcon} [${attachedFile.name}]`;
      }

      // Agregar el mensaje del usuario al chat
      setMessages(prev => [...prev, userMessage]);

      // Agregar mensaje de "analizando"
      const analyzingMessage: MessageData = {
        type: 'text',
        text: attachedFile 
          ? '¡Gracias! Estoy analizando tu archivo...'
          : 'Estoy analizando tu mensaje...',
        sender: 'system',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, analyzingMessage]);

      // Enviar mensaje a la API
      const response = await createMessage(
        chatId,
        inputMessage.trim(),
        attachedFile || undefined
      );

      // Remover el mensaje de "analizando"
      setMessages(prev => prev.filter(msg => msg !== analyzingMessage));

      // Procesar la respuesta del asistente
      const assistantMessage: MessageData = {
        type: response.data.action === 'preview' ? 'html' :
              response.data.action === 'graph' ? 'graph' :
              response.data.action === 'download' ? 'download' : 'text',
        sender: 'system',
        timestamp: new Date(response.data.timestamp).getTime()
      };

      // Configurar el contenido según el tipo de respuesta
      switch (response.data.action) {
        case 'preview':
          assistantMessage.content = response.data.message;
          break;
        case 'graph':
          try {
            console.log('Respuesta del servidor (graph):', response.data.message);
            const graphData = typeof response.data.message === 'string' 
              ? JSON.parse(response.data.message) 
              : response.data.message;
            
            // Asegurarnos de que el objeto tiene la estructura correcta
            if (graphData && typeof graphData === 'object') {
              assistantMessage.vegaSpec = {
                schema: graphData.schema || "https://vega.github.io/schema/vega-lite/v5.json",
                spec: graphData.spec || graphData // Si no tiene spec, asumimos que todo el objeto es la spec
              };
            } else {
              throw new Error('Formato de gráfico inválido');
            }
          } catch (error) {
            console.error('Error al procesar el gráfico:', error);
            assistantMessage.type = 'text';
            assistantMessage.text = 'Error: No se pudo procesar el gráfico.';
          }
          break;
        case 'download':
          assistantMessage.url = response.data.message;
          break;
        default:
          assistantMessage.text = response.data.message;
          // Agregar información del archivo si existe
          if (response.data.has_file && response.data.extension) {
            const fileIcon = getFileIcon(response.data.extension);
            assistantMessage.text = `${assistantMessage.text} ${fileIcon} [${response.data.extension}]`;
          }
      }

      // Agregar el mensaje del asistente al chat
      setMessages(prev => [...prev, assistantMessage]);

      // Limpiar el formulario después del envío exitoso
      setInputMessage('');
      setAttachedFile(null);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Mostrar mensaje de error en el chat
      const errorMessage: MessageData = {
        type: 'text',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
        sender: 'system',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Habilitar el formulario después de procesar
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {hasMore && (
          <button 
            className="load-more" 
            onClick={handleLoadMore}
            disabled={isLoading}
            aria-label={isLoading ? "Cargando mensajes..." : "Cargar mensajes anteriores"}
          >
            {isLoading ? (
              <>
                Cargando
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </>
            ) : (
              "Ver mensajes anteriores"
            )}
          </button>
        )}
        
        {messages.length === 0 ? (
          <div className="no-messages">No hay mensajes</div>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <div className="file-upload-area">
          {attachedFile ? (
            <div className="attached-file">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(attachedFile.name)}</span>
                <span className="file-name">{getFormattedFileName(attachedFile)}</span>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveFile}
                className="remove-file"
                title="Eliminar archivo"
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
          ) : (
            <FileDropzone onDrop={handleFileDrop} />
          )}
        </div>
        
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={attachedFile ? "Describe qué análisis deseas realizar con este archivo..." : "Escribe tu mensaje aquí..."}
            disabled={isLoading}
            rows={1}
            aria-label="Mensaje"
          />
          <button 
            type="submit" 
            disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
            aria-label={isLoading ? "Enviando..." : "Enviar mensaje"}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}; 