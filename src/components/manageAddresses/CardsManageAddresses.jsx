import React, { useState, Fragment } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import './manageAddressesScreen.css';
import { useNavigate } from 'react-router-dom';

const addressData = [
    {
        name: "Dirección Principal",
        country: "USA",
        state: "California",
        city: "Los Angeles",
        street: "123 Main St",
        postal_code: "90001"
    },
    {
        name: "Dirección Trabajo",
        country: "Canada",
        state: "Ontario",
        city: "Toronto",
        street: "456 Elm St",
        postal_code: "M4B 1B4"
    }
];

function CardsManageAddresses() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
    });

    const handleInsertAddress = () => {
        setShowModal(true);
    }

    const handleSaveAddress = () => {
        // Here you would normally save the new address to your backend or state
        console.log('New Address:', newAddress);
        setShowModal(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleEdit = (index) => {
        console.log(`Editar dirección en índice: ${index}`);
    };

    const handleDelete = (index) => {
        console.log(`Eliminar dirección en índice: ${index}`);
    };

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administracion de Direcciones</h2>
                </Col>
            </Row>
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
                                                <p><strong className='responsive-text'>Codigo Postal:</strong> {address.postal_code}</p>
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
                                                    <p><strong className='responsive-text'>Codigo Postal:</strong> {addressData[index + 1].postal_code}</p>
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
                    <Modal.Title>Agregar Dirección</Modal.Title>
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
                    <Button  onClick={() => setShowModal(false)} className='modal-button'>
                        Cancelar
                    </Button>
                    <Button  onClick={handleSaveAddress} className='modal-button'>
                        Guardar Dirección
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CardsManageAddresses;
