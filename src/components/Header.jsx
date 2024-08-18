import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import { BsPersonCircle, BsFillCartDashFill } from "react-icons/bs";
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import Logo from '../../src/assets/easyshop.png';
import axios from 'axios';

function Header() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://ha7f9zowr1.execute-api.us-east-1.amazonaws.com/Prod/login', {
                username,
                password
            });
            console.log('Login successful:', response.data);
            setShowLoginModal(false);
        } catch (error) {
            console.error('Login error:', error);
        }
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                            </li>
                        </ul>
                        <Dropdown>
                            <Dropdown.Toggle variant="transparent" id="user-dropdown">
                                <BsPersonCircle size={25} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                                    Inicio de sesión
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
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
