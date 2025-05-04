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
  type: 'text' | 'html' | 'image' | 'chart_data' | 'download';
  content?: string;
  text?: string;
  url?: string;
  chartType?: string;
  data?: ChartDataItem[];
  sender: 'user' | 'system';
  timestamp: number;
}

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
    type: 'chart_data',
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
    type: 'image',
    url: '/examples/sales-trend.png',
    text: 'Gráfico de tendencias de ventas del último trimestre',
    sender: 'system',
    timestamp: Date.now() + 7000
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

  // Maneja el envío de mensajes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: MessageData = {
      type: 'text',
      text: inputMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simula una respuesta del sistema después de 1 segundo
    setTimeout(() => {
      const systemResponse: MessageData = {
        type: 'text',
        text: '¡Gracias por tu mensaje! Estoy procesando tu solicitud...',
        sender: 'system',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, systemResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Maneja la subida de archivos
  const handleFileDrop = (files: File[]) => {
    const fileMessage: MessageData = {
      type: 'text',
      text: `Archivo(s) subido(s): ${files.map(f => f.name).join(', ')}`,
      sender: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, fileMessage]);
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
      
      <FileDropzone onDrop={handleFileDrop} />
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}; 