import React, { useState, Fragment, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function CardsManageAddresses() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [currentAddressIndex, setCurrentAddressIndex] = useState(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
    });

    const addressData = [
        {
            name: 'Casa Principal',
            country: 'México',
            state: 'CDMX',
            city: 'Ciudad de México',
            street: 'Calle Falsa 123',
            postal_code: '12345'
        },
        {
            name: 'Oficina',
            country: 'México',
            state: 'Jalisco',
            city: 'Guadalajara',
            street: 'Avenida Siempreviva 742',
            postal_code: '67890'
        }
    ];

    const handleInsertAddress = () => {
        setIsEditing(false);
        setNewAddress({
            name: '',
            country: '',
            state: '',
            city: '',
            street: '',
            postal_code: ''
        });
        setShowModal(true);
    };

    const handleEdit = (index) => {
        setIsEditing(true);
        setCurrentAddressIndex(index);
        setNewAddress(addressData[index]);
        setShowModal(true);
    };

    const handleSaveAddress = () => {
        if (isEditing) {
            addressData[currentAddressIndex] = newAddress;
        } else {
            addressData.push(newAddress);
        }
        setShowModal(false);
    };

    const validateInput = (name, value) => {
        const patterns = {
            name: /^[a-zA-Z\s]{0,35}$/,
            country: /^[a-zA-Z\s]{0,15}$/,
            state: /^[a-zA-Z\s]{0,15}$/,
            city: /^[a-zA-Z\s]{0,15}$/,
            street: /^.{0,20}$/,
            postal_code: /^\d{0,5}$/
        };
        return patterns[name].test(value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (validateInput(name, value)) {
            setNewAddress(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleDelete = (index) => {
        setSelectedAddressIndex(index);
        setShowDeleteModal(true);
    };
    
    const handleConfirmDelete = () => {
        addressData.splice(selectedAddressIndex, 1);
        setShowDeleteModal(false);
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administración de Direcciones</h2>
                </Col>
            </Row>

            {/* Validación del rol del usuario */}
            {user.user?.type === 'user' && (
                <>
                    <Row className='text-center'>
                        <Col>
                            <button className='responsive-button button-insert' onClick={handleInsertAddress}>Agregar Dirección</button>
                        </Col>
                    </Row>

                    {addressData.map((address, index) => (
                        <Fragment key={index}>
                            {index % 2 === 0 && (
                                <Row className="align-items-center justify-content-center mb-4 mt-2">
                                    <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                        <Card className="address-card card-design">
                                            <Card.Header className="text-center">{address.name}</Card.Header>
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col xs={12} md={6} className="text-center my-2">
                                                        <p><strong className='responsive-text'>País:</strong> {address.country}</p>
                                                        <p><strong className='responsive-text'>Estado:</strong> {address.state}</p>
                                                        <p><strong className='responsive-text'>Ciudad:</strong> {address.city}</p>
                                                    </Col>
                                                    <Col xs={12} md={6} className="text-center my-2">
                                                        <p><strong className='responsive-text'>Calle:</strong> {address.street}</p>
                                                        <p><strong className='responsive-text'>Código Postal:</strong> {address.postal_code}</p>
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center mt-3">
                                                    <Col xs={6} className="text-center mb-2">
                                                        <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index)}>Editar</Button>
                                                    </Col>
                                                    <Col xs={6} className="text-center">
                                                        <Button variant="danger" className="responsive-button" onClick={() => handleDelete(index)}>Eliminar</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    {addressData[index + 1] && (
                                        <Col xs={12} md={6} className="justify-content-center">
                                            <Card className="address-card card-design">
                                                <Card.Header className="text-center">{addressData[index + 1].name}</Card.Header>
                                                <Card.Body>
                                                    <Row className="align-items-center">
                                                        <Col xs={12} md={6} className="text-center my-2">
                                                            <p><strong className='responsive-text'>País:</strong> {addressData[index + 1].country}</p>
                                                            <p><strong className='responsive-text'>Estado:</strong> {addressData[index + 1].state}</p>
                                                            <p><strong className='responsive-text'>Ciudad:</strong> {addressData[index + 1].city}</p>
                                                        </Col>
                                                        <Col xs={12} md={6} className="text-center my-2">
                                                            <p><strong className='responsive-text'>Calle:</strong> {addressData[index + 1].street}</p>
                                                            <p><strong className='responsive-text'>Código Postal:</strong> {addressData[index + 1].postal_code}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="justify-content-center mt-3">
                                                        <Col xs={6} className="text-center mb-2">
                                                            <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index + 1)}>Editar</Button>
                                                        </Col>
                                                        <Col xs={6} className="text-center">
                                                            <Button variant="danger" className="responsive-button" onClick={() => handleDelete(index + 1)}>Eliminar</Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </Fragment>
                    ))}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Dirección' : 'Agregar Dirección'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el nombre"
                                        name="name"
                                        value={newAddress.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCountry">
                                    <Form.Label>País</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el país"
                                        name="country"
                                        value={newAddress.country}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formState">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el estado"
                                        name="state"
                                        value={newAddress.state}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCity">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la ciudad"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formStreet">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la calle"
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPostalCode">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el código postal"
                                        name="postal_code"
                                        value={newAddress.postal_code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleSaveAddress}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas eliminar esta dirección?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
            {user.user?.type === 'admin' && (
                <Row className='text-center'>
                    <Col>
                        <p>Los administradores no tienen acceso a esta sección.</p>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default CardsManageAddresses;
