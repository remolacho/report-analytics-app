import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Message.scss';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataItem {
  genero: string;
  cantidad: number;
}

interface MessageProps {
  message: {
    type: 'text' | 'html' | 'image' | 'chart_data' | 'download';
    content?: string;
    text?: string;
    url?: string;
    chartType?: string;
    data?: ChartDataItem[];
    sender: 'user' | 'system';
    timestamp: number;
  };
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="message-text">{message.text}</p>;
      
      case 'html':
        return (
          <div
            className="message-html"
            dangerouslySetInnerHTML={{ __html: message.content || '' }}
          />
        );
      
      case 'image':
        return (
          <div className="message-image-container">
            <img
              src={message.url}
              alt={message.text || 'Contenido del mensaje'}
              className="message-image"
              loading="lazy"
            />
            {message.text && <p className="message-image-caption">{message.text}</p>}
          </div>
        );
      
      case 'chart_data':
        if (message.chartType === 'bar' && message.data) {
          const chartData = {
            labels: message.data.map((item: ChartDataItem) => item.genero),
            datasets: [
              {
                label: 'Cantidad',
                data: message.data.map((item: ChartDataItem) => item.cantidad),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          };

          const options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Distribución por Género',
              },
            },
          };

          return (
            <div className="message-chart">
              <Bar data={chartData} options={options} />
            </div>
          );
        }
        return null;
      
      case 'download':
        return (
          <a
            href={message.url}
            download
            className="message-download"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="download-icon">⬇️</span>
            {message.text || 'Descargar archivo'}
          </a>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`message ${message.sender === 'user' ? 'message--user' : 'message--system'}`}>
      <div className="message-content">
        {renderContent()}
      </div>
      <div className="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}; 