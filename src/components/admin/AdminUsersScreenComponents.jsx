import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminUsersScreenComponents() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    name: '',
    lastname: '',
    birthdate: '',
    gender: '',
    type: 'admin',
    active: 1
  });
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const storedToken = localStorage.getItem('token');
  const token = storedToken || null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.user.type !== 'admin') {
      navigate('/');
      return;
    }
  
    if (users.length === 0) {
      Swal.fire({
        title: 'Cargando usuarios...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      axios.get('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/get_users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      })
        .then(response => {
          if (response.data && Array.isArray(response.data.users)) {
            setUsers(response.data.users);
          } else {
            console.error('Error al obtener los usuarios:', response.data);
          }
        })
        .catch(error => console.error('Error en la solicitud:', error))
        .finally(() => {
          if (Swal.isVisible()) {
            Swal.close();
          }
        });
    }
  }, [user, navigate, users]);

  const handleDisableUser = (userId) => {
    axios.patch(`https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/toggle_user_active/${userId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      }
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Se ha realizado exitosamente',
          showConfirmButton: false,
          timer: 1500
      });
        setUsers(users.map(u => u.id === userId ? { ...u, active: !u.active } : u));
      })
      .catch(error => console.error('Error en la solicitud:', error));
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);
  const handleCloseChangePasswordModal = () => setShowChangePasswordModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddAdmin = async () => {
    try {
        await axios.post('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/insert_admin', newAdmin, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            }
        });

        // Solo actualiza la lista de usuarios si la solicitud fue exitosa
        setUsers([...users, newAdmin]);
        setUsername(newAdmin.username);
        handleCloseModal();

        // Muestra el modal de cambio de contraseña para el nuevo admin
        setShowChangePasswordModal(true);
        Swal.fire({
            icon: 'success',
            title: 'Administrador agregado',
            showConfirmButton: false,
            timer: 1500
        });

    } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al agregar administrador',
            text: 'Verifica los datos e inténtalo de nuevo.'
        });
    }
  };

  const handleChangePassword = async () => {
    if (!username) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de usuario no está disponible. Inténtalo de nuevo.'
      });
      return;
    }

    try {
      const passwordData = {
        username,
        temp_password: tempPassword,
        new_password: newPassword
      };

      console.log('Change password data:', passwordData); 

      await axios.patch('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/update_user_temp_password_patch', passwordData);
      
      setShowChangePasswordModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Change password error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la contraseña',
        text: 'Verifica los datos e inténtalo de nuevo.'
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'left', color: '#333' }}>Gestión de Usuarios</h2>
        <Button 
          variant="pink"
          onClick={handleShowModal}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#ECA4AF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          Agregar Administrador
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar por nombre" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{
            padding: '8px',
            fontSize: '14px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '250px'
          }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', justifyContent: 'center' }}>
        {filteredUsers.map((user, index) => (
          <div 
            key={index} 
            style={{
              backgroundColor: '#fff',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '300px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
          >
            <div>
              <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
                <strong>Nombre:</strong> {user.username}
              </p>
              <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
                <strong>Correo Electrónico:</strong> {user.email}
              </p>
              <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
                <strong>Nombre Completo:</strong> {user.name} {user.lastname}
              </p>
              <p style={{ margin: '10px 0', color: '#555', fontSize: '16px' }}>
                <strong>Tipo:</strong> {user.type}
              </p>
            </div>
            <button 
              onClick={() => handleDisableUser(user.id)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#ECA4AF',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                alignSelf: 'center',
                marginTop: 'auto'
              }}
            >
              {user.active ? 'Deshabilitar' : 'Habilitar'}
            </button>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Administrador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control 
                type="text" 
                name="username"
                value={newAdmin.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastname">
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                type="text" 
                name="lastname"
                value={newAdmin.lastname}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBirthdate">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control 
                type="date" 
                name="birthdate"
                value={newAdmin.birthdate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>Género</Form.Label>
              <Form.Control 
                type="text" 
                name="gender"
                value={newAdmin.gender}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddAdmin}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cambiar la contraseña */}
      <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTempPassword">
              <Form.Label>Contraseña Temporal</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Ingresa la contraseña temporal"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>Contraseña Nueva</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChangePasswordModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Actualizar Contraseña
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminUsersScreenComponents;
