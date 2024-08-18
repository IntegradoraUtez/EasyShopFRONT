import React from 'react';
import './AdminUsersScreenComponents.css'; // Importa el archivo de estilos
import { useAuth } from '../../context/AuthContext';
function AdminUsersScreenComponents() {
  const {user} = useAuth();


  return (
    <div className="user-table-container">
      <h2>Gestión de Usuarios</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Correo Electrónico</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Tipo de Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>juanp</td>
            <td>juanp@example.com</td>
            <td>Juan Pérez</td>
            <td>123-456-7890</td>
            <td>Admin</td>
            <td>
              <button className="action-button update">Actualizar</button>
              <button className="action-button disable">Deshabilitar</button>
            </td>
          </tr>
          <tr>
            <td>anag</td>
            <td>anag@example.com</td>
            <td>Ana García</td>
            <td>098-765-4321</td>
            <td>Usuario</td>
            <td>
              <button className="action-button update">Actualizar</button>
              <button className="action-button disable">Deshabilitar</button>
            </td>
          </tr>
          {/* Añadir más filas aquí */}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersScreenComponents;
