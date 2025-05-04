import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileDropzone.scss';

interface FileDropzoneProps {
  onDrop: (files: File[]) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop }) => {
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setIsDraggingFile(false);
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDragEnter: () => setIsDraggingFile(true),
    onDragLeave: () => setIsDraggingFile(false),
    accept: {
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    noClick: false,
    noKeyboard: false
  });

  const isActive = isDragActive || isDraggingFile;

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isActive ? 'dropzone--active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-content">
        {isActive ? (
          <>
            <div className="dropzone-icon">📥</div>
            <p className="dropzone-text">¡Suelta los archivos aquí!</p>
          </>
        ) : (
          <>
            <div className="dropzone-icon">📎</div>
            <p className="dropzone-text">Arrastra archivos aquí o haz clic para seleccionar</p>
            <div className="dropzone-formats">
              <span className="format-badge">XLSX</span>
              <span className="format-badge">XLS</span>
              <span className="format-badge">CSV</span>
              <span className="format-badge">JSON</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 