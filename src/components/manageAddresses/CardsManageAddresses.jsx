import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function CardsManageAddresses() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const idUser = user.user.id;
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddressIndex, setCurrentAddressIndex] = useState(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
    });

    const corsHeaders = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        axios.get(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_addresses_by_Usersid/${idUser}`, { headers: corsHeaders })
            .then(response => {
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
            postal_code: '',
            Users_id: idUser
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
        axios({
            method,
            url,
            data: newAddress,
            headers: corsHeaders
        })
            .then(response => {
                if (isEditing) {
                    const updatedAddresses = [...addresses];
                    updatedAddresses[currentAddressIndex] = response.data;
                    setAddresses(updatedAddresses);
                } else {
                    setAddresses(prevAddresses => [...prevAddresses, response.data]);
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

    const handleToggleActivation = async (index) => {
        const id = addresses[index].id;
        try {
            await axios.patch(
                `https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/toggle_address_active/${id}`,
                {},
                { headers: corsHeaders }
            );
            setAddresses(addresses.map((address, i) =>
                i === index ? { ...address, active: !address.active } : address
            ));
        } catch (error) {
            console.error('Error toggling address activation:', error);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administración de Direcciones</h2>
                </Col>
            </Row>

            {user.user?.type === 'user' && (
                <>
                    <Row className='text-center'>
                        <Col>
                            <button className='responsive-button button-insert' onClick={handleInsertAddress}>Agregar Dirección</button>
                        </Col>
                    </Row>

                    {addresses.length > 0 ? (
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
                                                        {address.active && (
                                                            <Col xs={6} className="text-center mb-2">
                                                                <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index)}>Editar</Button>
                                                            </Col>
                                                        )}
                                                        <Col xs={6} className="text-center">
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
                                                            {addresses[index + 1].active ? (
                                                                <Col xs={6} className="text-center mb-2">
                                                                    <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index + 1)}>Editar</Button>
                                                                </Col>
                                                            ) : (
                                                                <Col xs={6} className="text-center mb-2">
                                                                    {/* Si no está activa, no renderizar el botón */}
                                                                </Col>
                                                            )}
                                                            {addresses[index + 1].active ? (
                                                                <Col xs={6} className="text-center">
                                                                    <Button variant="warning" className="responsive-button" onClick={() => handleToggleActivation(index + 1)}>
                                                                        {addresses[index + 1].active ? 'Desactivar' : 'Activar'}
                                                                    </Button>
                                                                </Col>
                                                            ) : (
                                                                <Col xs={12} className="text-center mb-2">
                                                                    {/* Si no está activa, no renderizar el botón */}
                                                                    <Col xs={12} className="text-center">
                                                                        <Button variant="warning" className="responsive-button" onClick={() => handleToggleActivation(index + 1)}>
                                                                            {addresses[index + 1].active ? 'Desactivar' : 'Activar'}
                                                                        </Button>
                                                                    </Col>
                                                                </Col>
                                                            )}

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
                        <Row className='text-center'>
                            <Col>
                                <p>No tienes direcciones registradas.</p>
                            </Col>
                        </Row>
                    )}

                    {/* Modal para Agregar/Editar Dirección */}
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
                                        name="name"
                                        value={newAddress.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de la dirección"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddressCountry">
                                    <Form.Label>País</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={newAddress.country}
                                        onChange={handleInputChange}
                                        placeholder="País"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddressState">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={newAddress.state}
                                        onChange={handleInputChange}
                                        placeholder="Estado"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddressCity">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleInputChange}
                                        placeholder="Ciudad"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddressStreet">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleInputChange}
                                        placeholder="Calle"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddressPostalCode">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="postal_code"
                                        value={newAddress.postal_code}
                                        onChange={handleInputChange}
                                        placeholder="Código Postal"
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleSaveAddress}>
                                    {isEditing ? 'Actualizar Dirección' : 'Agregar Dirección'}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
}

export default CardsManageAddresses;
