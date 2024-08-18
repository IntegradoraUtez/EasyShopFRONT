import React, {useEffect} from 'react';
import './AdminPurchaseComponents.css'; // Importa el archivo de estilos
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function AdminPurchaseComponents() {
  const {user} = useAuth();
  const navigate = useNavigate;
    
  useEffect(() => {
      if (!user || user.user.type !== 'admin') {
          navigate('/'); 
      } else {
          console.log('Tipo:', user.user.type);
          console.log('Token:', user.token);
      }

  }, [user, navigate]);


  return (
    <div className="purchase-table-container">
      <h2>Historial de Compras</h2>
      <table className="purchase-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Fecha</th>          
            <th>Dirección</th>
            <th>Metodo de Pago</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>2024-07-28</td>
            <td>Calle Falsa 123, Ciudad</td>
            <td>Tarjeta de Crédito</td>
            <td>$100.00</td>
          </tr>
          <tr>
            <td>Juan Pérez</td>
            <td>2024-07-28</td>
            <td>Calle Falsa 123, Ciudad</td>
            <td>Tarjeta de Crédito</td>
            <td>$100.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminPurchaseComponents;
