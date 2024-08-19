import React, { useEffect, useState } from 'react';
import './AdminUsersScreenComponents.css'; 
import { useNavigate } from 'react-router-dom';

function AdminUsersScreenComponents() {
  const [users, setUsers] = useState([]);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const storedToken = localStorage.getItem('token');
  const token = storedToken || null;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.user.type !== 'admin') {
      navigate('/'); 
    } else {
      fetch('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/get_users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data && Array.isArray(data.users)) {
            setUsers(data.users);
          } else {
            console.error('Error al obtener los usuarios:', data);
          }
        })
        .catch(error => console.error('Error en la solicitud:', error));
    }
  }, [user, navigate, token]);

  const handleConvertToAdmin = (userId) => {
    // Lógica para convertir al usuario en administrador
    console.log('Convertir usuario con ID:', userId);
  };

  const handleDisableUser = (userId) => {
    // Lógica para deshabilitar al usuario
    console.log('Deshabilitar usuario con ID:', userId);
  };

  return (
    <div className="user-table-container">
      <h2>Gestión de Usuarios</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Correo Electrónico</th>
            <th>Nombre Completo</th>
            <th>Tipo de Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.name} {user.lastname}</td>
              <td>{user.type}</td>
              <td>
                {user.type === 'user' && (
                  <button 
                    className="action-button update" 
                    onClick={() => handleConvertToAdmin(user.id)}
                  >
                    Convertir en Admin
                  </button>
                )}
                <button 
                  className="action-button disable" 
                  onClick={() => handleDisableUser(user.id)}
                >
                  Deshabilitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersScreenComponents;
