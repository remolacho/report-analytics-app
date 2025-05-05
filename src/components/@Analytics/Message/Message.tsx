import React from 'react';
import { VegaLite } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';
import './Message.scss';

interface MessageProps {
  message: {
    type: 'text' | 'html' | 'graph' | 'download';
    content?: string;
    text?: string;
    url?: string;
    vegaSpec?: VisualizationSpec;
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
      
      case 'graph':
        if (message.vegaSpec) {
          return (
            <div className="message-chart">
              <VegaLite spec={message.vegaSpec} />
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