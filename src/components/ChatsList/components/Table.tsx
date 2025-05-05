import React from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export interface Chat {
  uid: string;
  createdAt: Date;
  reference: string;
}

interface TableProps {
  chats: Chat[];
  onDelete: (uid: string) => void;
}

export const Table: React.FC<TableProps> = ({ chats, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (uid: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(uid);
        Swal.fire(
          'Eliminado!',
          'El chat ha sido eliminado.',
          'success'
        );
      }
    });
  };

  const handleView = (uid: string) => {
    navigate(`/chat-analytic/${uid}`);
  };

  return (
    <div className="table-container">
      <table className="chats-table">
        <tbody>
          {chats.map((chat) => (
            <tr key={chat.uid}>
              <td>{chat.uid}</td>
              <td>{new Date(chat.createdAt).toLocaleDateString()}</td>
              <td>{chat.reference}</td>
              <td className="actions-column">
                <button
                  className="view-button"
                  onClick={() => handleView(chat.uid)}
                >
                  <FaEye />
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(chat.uid)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 