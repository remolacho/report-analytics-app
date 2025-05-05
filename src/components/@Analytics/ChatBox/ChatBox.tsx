import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../Message';
import { FileDropzone } from '../FileDropzone';
import './ChatBox.scss';

interface ChartDataItem {
  genero: string;
  cantidad: number;
}

// Tipos de mensajes que puede manejar el chat
interface MessageData {
  type: 'text' | 'html' | 'graph' | 'download';
  content?: string;
  text?: string;
  url?: string;
  chartType?: string;
  data?: ChartDataItem[];
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

// Datos de ejemplo para simular respuestas del sistema
const dummyResponses: MessageData[] = [
  {
    type: 'text',
    text: 'Hola, ¿en qué te puedo ayudar hoy? Puedes subir archivos Excel o JSON para analizarlos.',
    sender: 'system',
    timestamp: Date.now()
  },
  {
    type: 'text',
    text: 'Quiero analizar datos de ventas del último trimestre',
    sender: 'user',
    timestamp: Date.now() + 1000
  },
  {
    type: 'text',
    text: 'Por favor, sube tu archivo de ventas y lo analizaré para ti.',
    sender: 'system',
    timestamp: Date.now() + 2000
  },
  {
    type: 'text',
    text: 'He subido el archivo ventas_q4.xlsx',
    sender: 'user',
    timestamp: Date.now() + 3000
  },
  {
    type: 'text',
    text: 'Analizando tu archivo... Aquí tienes un resumen de las ventas:',
    sender: 'system',
    timestamp: Date.now() + 4000
  },
  {
    type: 'html',
    content: `
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ventas</th>
            <th>Crecimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Octubre</td><td>$45,000</td><td>+8%</td></tr>
          <tr><td>Noviembre</td><td>$52,000</td><td>+15%</td></tr>
          <tr><td>Diciembre</td><td>$68,000</td><td>+30%</td></tr>
        </tbody>
      </table>
    `,
    sender: 'system',
    timestamp: Date.now() + 5000
  },
  {
    type: 'graph',
    chartType: 'bar',
    data: [
      { genero: 'Octubre', cantidad: 45000 },
      { genero: 'Noviembre', cantidad: 52000 },
      { genero: 'Diciembre', cantidad: 68000 }
    ],
    sender: 'system',
    timestamp: Date.now() + 6000
  },
  {
    type: 'text',
    text: 'He generado un reporte detallado en PDF para ti:',
    sender: 'system',
    timestamp: Date.now() + 8000
  },
  {
    type: 'download',
    url: '/examples/reporte_ventas_q4.pdf',
    text: 'Reporte de Ventas Q4 2023 (PDF)',
    sender: 'system',
    timestamp: Date.now() + 9000
  }
];

export const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simula la carga de mensajes anteriores
  useEffect(() => {
    setMessages(dummyResponses);
  }, []);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Simula el envío a la API
  const sendToAPI = async (formData: FormData): Promise<void> => {
    // TODO: Reemplazar con la llamada real a la API
    console.log('Datos que se enviarían a la API:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    // Simula un tiempo de respuesta de 5 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Simula una respuesta exitosa
    return Promise.resolve();
  };

  // Maneja el envío de mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachedFile) return;

    // Deshabilitar el formulario mientras se procesa
    setIsLoading(true);

    // Crear FormData
    const formData = new FormData();
    if (inputMessage.trim()) {
      formData.append('message', inputMessage.trim());
    }
    if (attachedFile) {
      formData.append('file', attachedFile);
    }

    // Preparar mensajes para mostrar en el chat
    const messages: MessageData[] = [];

    // Agregar mensaje de texto
    if (inputMessage.trim()) {
      messages.push({
        type: 'text',
        text: inputMessage,
        sender: 'user',
        timestamp: Date.now()
      });
    }

    // Agregar archivo si hay uno adjunto
    if (attachedFile) {
      const extension = attachedFile.name.split('.').pop()?.toUpperCase() || '';
      const fileIcon = getFileIcon(attachedFile.name);
      messages.push({
        type: 'text',
        text: `${fileIcon} Archivo ${extension} adjunto: ${attachedFile.name}`,
        sender: 'user',
        timestamp: Date.now()
      });
    }

    // Agregar mensajes al chat
    setMessages(prev => [...prev, ...messages]);

    try {
      // Enviar datos a la API
      await sendToAPI(formData);

      // Limpiar el formulario después del envío exitoso
      setInputMessage('');
      setAttachedFile(null);

      // Simular respuesta del sistema
      const systemResponse: MessageData = {
        type: 'text',
        text: '¡Gracias! Estoy analizando tu archivo...',
        sender: 'system',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, systemResponse]);
    } catch (error) {
      // Manejar error
      const errorMessage: MessageData = {
        type: 'text',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
        sender: 'system',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error al enviar datos:', error);
    } finally {
      // Habilitar el formulario después de procesar
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
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
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={attachedFile ? "Describe qué análisis deseas realizar con este archivo..." : "Escribe tu mensaje aquí..."}
            disabled={isLoading}
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