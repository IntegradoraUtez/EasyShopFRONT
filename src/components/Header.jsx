import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { BsPersonCircle, BsFillCartDashFill } from "react-icons/bs";
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import Logo from '../../src/assets/easyshop.png';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Header() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        name: '',
        lastname: '',
        birthdate: '',
        gender: ''
    });
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        Swal.fire({
            title: 'Iniciando Sesión',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await axios.post('https://ha7f9zowr1.execute-api.us-east-1.amazonaws.com/Prod/login', {
                username,
                password
            });

            const userData = {
                token: response.data.auth.id_token,
                user: response.data.user
            };

            login(userData);

            setShowLoginModal(false);
            setUsername(''); // Clear username after successful login
            setPassword(''); // Clear password after successful login

            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                showConfirmButton: false,
                timer: 1500
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: 'Verifica tus credenciales e inténtalo de nuevo.'
            });
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/insert_user', registerData);
            setUsername(registerData.username); // Guarda el username después del registro exitoso
            setShowRegisterModal(false);
            setRegisterData({
                username: '',
                email: '',
                name: '',
                lastname: '',
                birthdate: '',
                gender: ''
            }); // Clear registration data
            setShowChangePasswordModal(true);
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrarse',
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


            await axios.patch('https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/update_user_temp_password_patch', passwordData);
            
            setShowChangePasswordModal(false);
            setTempPassword(''); // Clear temporary password
            setNewPassword(''); // Clear new password
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

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Cerrarás tu sesión actual.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/');  // Redirigir al usuario a la página principal
                setUsername(''); // Clear username when logging out
                setPassword(''); // Clear password when logging out
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} style={{ height: 90, width: 150 }} alt="EasyShop" className="imagenLogo" />
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            {user && user.user.type === 'admin' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                                </li>
                            )}
                        </ul>
                        <Dropdown>
                            <Dropdown.Toggle variant="transparent" id="user-dropdown">
                                <BsPersonCircle size={25} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {!user ? (
                                    <>
                                        <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                                            Inicio de sesión
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowRegisterModal(true)}>
                                            Regístrate
                                        </Dropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        {user && user.user.type === 'user' && (
                            <button className="btn ms-2">
                                <Link to="/car">
                                    <BsFillCartDashFill size={25} />
                                </Link>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet />
            </div>

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={() => { setShowLoginModal(false); setUsername(''); setPassword(''); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Inicio de sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa tu nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowLoginModal(false); setUsername(''); setPassword(''); }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleLogin}>
                        Iniciar sesión
                    </Button>
                </Modal.Footer>
                <Modal.Footer>
                    <Button variant="link" onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }}>
                        ¿No tienes cuenta? Regístrate aquí
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Register Modal */}
            <Modal show={showRegisterModal} onHide={() => { setShowRegisterModal(false); setRegisterData({ username: '', email: '', name: '', lastname: '', birthdate: '', gender: '' }); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Form fields for registration */}
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa tu nombre de usuario"
                                value={registerData.username}
                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Ingresa tu email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa tu nombre"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastname">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa tu apellido"
                                value={registerData.lastname}
                                onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBirthdate">
                            <Form.Label>Fecha de nacimiento</Form.Label>
                            <Form.Control 
                                type="date" 
                                placeholder="Ingresa tu fecha de nacimiento"
                                value={registerData.birthdate}
                                onChange={(e) => setRegisterData({ ...registerData, birthdate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGender">
                            <Form.Label>Género</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingresa tu género"
                                value={registerData.gender}
                                onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowRegisterModal(false); setRegisterData({ username: '', email: '', name: '', lastname: '', birthdate: '', gender: '' }); }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleRegister}>
                        Registrarse
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showChangePasswordModal} onHide={() => { setShowChangePasswordModal(false); setTempPassword(''); setNewPassword(''); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTempPassword">
                            <Form.Label>Contraseña Temporal</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Ingresa tu contraseña temporal"
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
                    <Button variant="secondary" onClick={() => { setShowChangePasswordModal(false); setTempPassword(''); setNewPassword(''); }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        Cambiar Contraseña
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Header;
