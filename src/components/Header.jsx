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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
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

            // Mostrar SweetAlert de confirmación de inicio de sesión
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                showConfirmButton: false,
                timer: 1500
            });

        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: 'Verifica tus credenciales e inténtalo de nuevo.'
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
                                    <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                                        Inicio de sesión
                                    </Dropdown.Item>
                                ) : (
                                    <>
                                        <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <button className="btn ms-2">
                            <Link to="/car">
                                <BsFillCartDashFill size={25} />
                            </Link>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet />
            </div>

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
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
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleLogin}>
                        Iniciar sesión
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Header;
