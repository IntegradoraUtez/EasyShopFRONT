import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminPurchaseComponents.css'; // Importa el archivo de estilos
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminPurchaseComponents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [addresses, setAddresses] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    if (!user || user.user.type !== 'admin') {
      navigate('/'); 
    } else {
      const fetchPurchases = async () => {
        try {
          // Mostrar SweetAlert2 para indicar carga
          Swal.fire({
            title: 'Cargando...',
            text: 'Por favor, espere mientras se obtienen los datos.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          // Obtener datos de compras
          const response = await axios.get('https://u5cudf8m2b.execute-api.us-east-1.amazonaws.com/Prod/get_purchases', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });

          if (response.data && response.data.purchases) {
            const purchasesArray = Object.values(response.data.purchases);
            setPurchases(purchasesArray);

            // Obtener datos de usuarios
            const userPromises = purchasesArray.map(purchase =>
              axios.get(`https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/get_user_by_id/${purchase.users_id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }).then(userResponse => ({
                id: purchase.users_id,
                data: userResponse.data.user
              }))
            );

            const userResults = await Promise.all(userPromises);
            const usersMap = userResults.reduce((acc, { id, data }) => {
              acc[id] = data;
              return acc;
            }, {});
            
            setUsers(usersMap);

            // Obtener datos de direcciones
            const addressPromises = purchasesArray.map(purchase =>
              axios.get(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_address_by_id/${purchase.address_id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }).then(addressResponse => {
                // Accede al primer elemento del array de direcciones
                const addressData = addressResponse.data[Object.keys(addressResponse.data)[0]][0];
                return {
                  id: purchase.address_id,
                  data: addressData
                };
              })
            );

            const addressResults = await Promise.all(addressPromises);
            const addressesMap = addressResults.reduce((acc, { id, data }) => {
              acc[id] = data;
              return acc;
            }, {});
            
            setAddresses(addressesMap);

            // Obtener datos de métodos de pago
            const paymentMethodPromises = purchasesArray.map(purchase =>
              axios.get(`https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/get_paymentMethod_by_id/${purchase.paymentMethod_id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }).then(paymentMethodResponse => {
                // Accede al primer elemento del array de métodos de pago
                const paymentMethodData = paymentMethodResponse.data[Object.keys(paymentMethodResponse.data)[0]][0];
                return {
                  id: purchase.paymentMethod_id,
                  data: paymentMethodData
                };
              })
            );

            const paymentMethodResults = await Promise.all(paymentMethodPromises);
            const paymentMethodsMap = paymentMethodResults.reduce((acc, { id, data }) => {
              acc[id] = data;
              return acc;
            }, {});
            
            setPaymentMethods(paymentMethodsMap);
            console.log("Payment Methods Map:", paymentMethodsMap); // Añadido para ver los datos

            // Ocultar SweetAlert2 cuando los datos estén listos
            Swal.close();
            setLoading(false); // Ocultar la carga
          } else {
            console.error("Formato de datos inesperado:", response.data);
            Swal.close(); // Cerrar el loading en caso de error
          }
        } catch (err) {
          console.error("Error fetching purchases", err);
          Swal.close(); // Cerrar el loading en caso de error
        }
      };

      fetchPurchases();
    }
  }, [user, navigate]);

  if (loading) {
    return null; // No renderizar nada mientras se carga
  }

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
          {purchases.length > 0 ? (
            purchases.map((purchase) => {
              const userInfo = users[purchase.users_id];
              const addressInfo = addresses[purchase.address_id];
              const paymentMethodInfo = paymentMethods[purchase.paymentMethod_id];
              const userName = userInfo ? `${userInfo.name} ${userInfo.lastname}` : 'Desconocido';
              const address = addressInfo ? `${addressInfo.street}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.country}` : 'Desconocida';
              const paymentMethod = paymentMethodInfo ? `Tarjeta de ${paymentMethodInfo.card_type}` : 'Desconocido';
              return (
                <tr key={purchase.purchase_id}>
                  <td>{userName}</td>
                  <td>{new Date(purchase.datetime).toLocaleDateString()}</td>
                  <td>{address}</td>
                  <td>{paymentMethod}</td>
                  <td>${purchase.totalPrice.toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No hay compras disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPurchaseComponents;
