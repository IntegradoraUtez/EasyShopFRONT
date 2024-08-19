import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';  // Asegúrate de que el contexto de autenticación esté correctamente importado
import './purchases.css'
function ViewPurchases() {
  const { user } = useAuth(); // Obtén el usuario del contexto
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.user && user.user.id) {
      const fetchPurchases = async () => {
        try {
          // Muestra el SweetAlert de carga
          Swal.fire({
            title: 'Cargando...',
            text: 'Estamos cargando tus compras',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const response = await axios.get(
            `https://u5cudf8m2b.execute-api.us-east-1.amazonaws.com/Prod/get_purchases_by_Usersid/${user.user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          // Verifica la estructura de la respuesta
          console.log(response.data);
          
          // Convierte el objeto de compras en un array
          const purchasesArray = Object.values(response.data.purchases);
          setPurchases(purchasesArray);
        } catch (err) {
          setError('Error al cargar las compras');
        } finally {
          setLoading(false);
          // Cierra el SweetAlert
          Swal.close();
        }
      };

      fetchPurchases();
    } else {
      setError('Usuario no encontrado');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    // Este código se ejecutará solo si la carga está en progreso, pero no será visible ya que el SweetAlert está abierto
    return null;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="purchase-table-container">
      <h2>Historial de Compras</h2>
      {purchases.length === 0 ? (
        <p>No tienes compras.</p>
      ) : (
        <table className="purchase-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.purchase_id}>
                <td>{new Date(purchase.datetime).toLocaleString()}</td>
                <td>${purchase.totalPrice}</td>
                <td>
                  {purchase.products.map(product => (
                    <div key={product.product_id} className="d-flex align-items-center mb-2">
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                      <div>
                        {product.name} (x{product.quantity})
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewPurchases;
