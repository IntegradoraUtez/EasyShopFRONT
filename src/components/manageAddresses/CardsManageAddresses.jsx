import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

function CardsManageAddresses() {
    const { user } = useAuth();
    const idUser = user?.user?.id;
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
    const [loading, setLoading] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [addressToToggle, setAddressToToggle] = useState(null);

    const corsHeaders = {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
    };

    const showLoading = () => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };

    const closeLoading = () => {
        Swal.close();
    };

    useEffect(() => {
        fetchAddresses();
    }, [idUser, updateTrigger]);

    const fetchAddresses = () => {
        setLoading(true);
        axios.get(`https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_addresses_by_Usersid/${idUser}`, { headers: corsHeaders })
            .then(response => {
                setAddresses(response.data.addresses || []);
                closeLoading();
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
        setLoading(true);
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
            .then(() => {
                fetchAddresses();
                setShowModal(false);

                // Mostrar alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: isEditing ? 'Dirección actualizada con éxito' : 'Dirección agregada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error('Error saving address:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validateInput = (name, value) => {
        const patterns = {
            name: /^[a-zA-Z\s]{0,35}$/,
            country: /^[a-zA-Z\s]{0,15}$/,
            state: /^[a-zA-Z\s]{0,15}$/,
            city: /^[a-zA-Z\s]{0,25}$/,
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

    const handleToggleActivation = async () => {
        const id = addresses[addressToToggle].id;
        try {
            const action = addresses[addressToToggle].active ? 'desactivar' : 'activar';
            await axios.patch(
                `https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/toggle_address_active/${id}`,
                {},
                { headers: corsHeaders }
            );
            setAddresses(addresses.map((address, i) =>
                i === addressToToggle ? { ...address, active: !address.active } : address
            ));

            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: `Dirección ${action}da con éxito`,
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error toggling address activation:', error);
        } finally {
            setShowConfirmationModal(false);
            setAddressToToggle(null);
        }
    };

    const confirmToggleActivation = (index) => {
        setAddressToToggle(index);
        setShowConfirmationModal(true);
    };

    const cancelToggleActivation = () => {
        setShowConfirmationModal(false);
        setAddressToToggle(null);
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

                    {loading ? (
                        <Row className="text-center">
                            <Col>
                                <Spinner animation="border" />
                            </Col>
                        </Row>
                    ) : (
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
                                                            <Button 
                                                                variant="primary" 
                                                                className={`responsive-button ${!address.active ? 'button-disabled' : ''}`} 
                                                                onClick={() => handleEdit(index)}
                                                                disabled={!address.active}
                                                            >
                                                                Editar
                                                            </Button>
                                                        </Col>
                                                        <Col xs={6} className="text-center">
                                                            <Button 
                                                                variant={address.active ? "danger" : "success"} 
                                                                className="responsive-button" 
                                                                onClick={() => confirmToggleActivation(index)}
                                                            >
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
                                                                <Button 
                                                                    variant="primary" 
                                                                    className={`responsive-button ${!addresses[index + 1].active ? 'button-disabled' : ''}`} 
                                                                    onClick={() => handleEdit(index + 1)}
                                                                    disabled={!addresses[index + 1].active}
                                                                >
                                                                    Editar
                                                                </Button>
                                                            </Col>
                                                            <Col xs={6} className="text-center">
                                                                <Button 
                                                                    variant={addresses[index + 1].active ? "danger" : "success"} 
                                                                    className="responsive-button" 
                                                                    onClick={() => confirmToggleActivation(index + 1)}
                                                                >
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
                    )}

                    {/* Modal para agregar o editar dirección */}
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
                                        placeholder="Nombre"
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
                                <Form.Group className="text-center mt-4">
                                    <Button variant="primary" onClick={handleSaveAddress} disabled={loading}>
                                        {isEditing ? 'Guardar Cambios' : 'Agregar Dirección'}
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Modal de confirmación para desactivar/activar */}
                    <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que quieres {addresses[addressToToggle]?.active ? 'desactivar' : 'activar'} esta dirección?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={cancelToggleActivation}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleToggleActivation}>
                                Confirmar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </>
    );
}

export default CardsManageAddresses;
