import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function CardsManageAddresses() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const idUser = user.user.id
    const [addresses, setAddresses] = useState([]);
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

    // CORS headers configuration
    const corsHeaders = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        axios.get(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_addresses_by_Usersid/${idUser}`, { headers: corsHeaders })
            .then(response => {
                console.log('Response data:', response.data.addresses);
                setAddresses(response.data.addresses || []);
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    }, [idUser]);
    

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
        setNewAddress(addresses[index]);
        setShowModal(true);
    };

    const handleSaveAddress = () => {
        const url = isEditing
            ? 'https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/update_address_put'
            : 'https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/insert_address';

        const method = isEditing ? 'put' : 'post';
        const addressPayload = { ...newAddress };

        axios({
            method,
            url,
            data: addressPayload,
            headers: corsHeaders
        })
            .then(response => {
                if (isEditing) {
                    const updatedAddresses = [...addresses];
                    updatedAddresses[currentAddressIndex] = newAddress;
                    setAddresses(updatedAddresses);
                } else {
                    setAddresses([...addresses, response.data]);
                }
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error saving address:', error);
            });
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
        const id = addresses[selectedAddressIndex].id;
        axios.delete(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/delete_address/${id}`, { headers: corsHeaders })
            .then(() => {
                const updatedAddresses = addresses.filter((_, i) => i !== selectedAddressIndex);
                setAddresses(updatedAddresses);
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error('Error deleting address:', error);
            });
    };

    const handleToggleActivation = (index) => {
        const id = addresses[index].id;
        axios.post(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/toggle_address_active/${id}`, {}, { headers: corsHeaders })
            .then(response => {
                const updatedAddresses = [...addresses];
                updatedAddresses[index] = response.data;
                setAddresses(updatedAddresses);
            })
            .catch(error => {
                console.error('Error toggling address activation:', error);
            });
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

                    {Array.isArray(addresses) && addresses.length > 0 ? (
                        addresses.map((address, index) => (
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
                                                        <Col xs={12} className="text-center mt-2">
                                                            <Button variant="warning" className="responsive-button" onClick={() => handleToggleActivation(index)}>
                                                                {address.active ? 'Desactivar' : 'Activar'}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        {index + 1 < addresses.length && (
                                            <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                                <Card className="address-card card-design">
                                                    <Card.Header className="text-center">{addresses[index + 1].name}</Card.Header>
                                                    <Card.Body>
                                                        <Row className="align-items-center">
                                                            <Col xs={12} md={6} className="text-center my-2">
                                                                <p><strong className='responsive-text'>País:</strong> {addresses[index + 1].country}</p>
                                                                <p><strong className='responsive-text'>Estado:</strong> {addresses[index + 1].state}</p>
                                                                <p><strong className='responsive-text'>Ciudad:</strong> {addresses[index + 1].city}</p>
                                                            </Col>
                                                            <Col xs={12} md={6} className="text-center my-2">
                                                                <p><strong className='responsive-text'>Calle:</strong> {addresses[index + 1].street}</p>
                                                                <p><strong className='responsive-text'>Código Postal:</strong> {addresses[index + 1].postal_code}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row className="justify-content-center mt-3">
                                                            <Col xs={6} className="text-center mb-2">
                                                                <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index + 1)}>Editar</Button>
                                                            </Col>
                                                            <Col xs={6} className="text-center">
                                                                <Button variant="danger" className="responsive-button" onClick={() => handleDelete(index + 1)}>Eliminar</Button>
                                                            </Col>
                                                            <Col xs={12} className="text-center mt-2">
                                                                <Button variant="warning" className="responsive-button" onClick={() => handleToggleActivation(index + 1)}>
                                                                    {addresses[index + 1].active ? 'Desactivar' : 'Activar'}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )}
                                    </Row>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <p>No hay direcciones disponibles.</p>
                    )}


                    {/* Modal for insert and edit */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Dirección' : 'Agregar Dirección'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formAddressName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        name="name"
                                        value={newAddress.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCountry">
                                    <Form.Label>País</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el país"
                                        name="country"
                                        value={newAddress.country}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formState">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el estado"
                                        name="state"
                                        value={newAddress.state}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCity">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la ciudad"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formStreet">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la calle"
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPostalCode">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el código postal"
                                        name="postal_code"
                                        value={newAddress.postal_code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleSaveAddress}>
                                {isEditing ? 'Guardar Cambios' : 'Agregar Dirección'}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete confirmation modal */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que quieres eliminar esta dirección?
                        </Modal.Body>
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
        </>
    );
}

export default CardsManageAddresses;
