import React, { useState } from 'react';
import { CustomVegaChart } from '../VegaChart/CustomVegaChart';
import { VegaRailsSpec } from '../../../types/vega';
import './Message.scss';

interface MessageProps {
  message: {
    type: 'text' | 'html' | 'graph' | 'download';
    content?: string;
    text?: string;
    url?: string;
    vegaSpec?: VegaRailsSpec;
    sender: 'user' | 'system';
    timestamp: number;
  };
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExport = (format: string) => {
    // TODO: Implementar cuando el endpoint esté disponible
    console.log(`Exportar en formato ${format} no implementado aún`);
    setIsDropdownOpen(false);
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="message-text">{message.text}</p>;
      
      case 'html':
        return (
          <div className="message-html">
            <div className="export-dropdown">
              <button 
                className="export-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="Exportar datos"
              >
                <span className="icon">⤓</span>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => handleExport('xlsx')}>XLSX</button>
                  <button onClick={() => handleExport('csv')}>CSV</button>
                  <button onClick={() => handleExport('json')}>JSON</button>
                </div>
              )}
            </div>
            <br />
            <div
              className="html-content"
              dangerouslySetInnerHTML={{ __html: message.content || '' }}
            />
          </div>
        );
      
      case 'graph':
        if (message.vegaSpec?.spec) {
          return (
            <div className="message-chart">
              <CustomVegaChart spec={message.vegaSpec.spec} />
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