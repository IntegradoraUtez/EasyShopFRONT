import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import './registerCardScreen.css';
import { useNavigate } from 'react-router-dom';
import chip from '../../assets/tarjeta-de-credito.png';
import visa from '../../assets/simbolos.png';
import {
    FuncionNumeroTarjeta,
    FuncionIdentificarTipoTarjeta,
    FuncionFormatMesAño,
} from './validaciones';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

function NewCard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const userId = user.user.id
    const [cardData, setCardData] = useState({
        alias: "",
        card_number: "",
        card_owner: "",
        card_type: "",
        card_zip: "",
        card_expiration: "",
        card_cvv: "",
        Users_id: userId
    });

    // Redirect if the user role is not 'user'
    if (user.user.type !== 'user') {
        navigate('/');
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newErrors = { ...errors };

        if (name === 'card_owner') {
            newErrors.card_owner = /^[A-Za-z\s]+$/.test(value) ? null : 'El nombre solo debe contener letras.';
        } else if (name === 'card_zip') {
            newErrors.card_zip = /^\d{0,5}$/.test(value) ? null : 'El código postal debe ser un número de hasta 5 dígitos.';
        } else if (name === 'card_cvv') {
            newErrors.card_cvv = /^\d{0,3}$/.test(value) ? null : 'El CVV debe ser un número de 3 dígitos.';
        }

        setErrors(newErrors);

        setCardData({
            ...cardData,
            [name]: value,
        });
    };

    const validateFields = () => {
        const isCardOwnerValid = /^[A-Za-z\s]+$/.test(cardData.card_owner) && cardData.card_owner.length > 0;
        const isCardZipValid = /^\d{5}$/.test(cardData.card_zip);
        const isCardCvvValid = /^\d{3}$/.test(cardData.card_cvv);

        return isCardOwnerValid && isCardZipValid && isCardCvvValid && cardData.card_number && cardData.card_type && cardData.card_expiration;
    };

    const handleCardNumberChange = (e) => {
        const formattedCardNumber = FuncionNumeroTarjeta(e.target.value.replace(/\D/g, ''));
        setCardData({
            ...cardData,
            card_number: formattedCardNumber,
            card_type: FuncionIdentificarTipoTarjeta(formattedCardNumber),
        });
    };

    const handleExpirationChange = (e) => {
        const formattedExpiration = FuncionFormatMesAño(e.target.value);
        setCardData({
            ...cardData,
            card_expiration: formattedExpiration,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (validateFields()) {
            // Mostrar mensaje de carga
            Swal.fire({
                title: 'Procesando...',
                text: 'Por favor, espere mientras se realiza la acción.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            // Axios request
            axios.post('https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/insert_paymentMethod', cardData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Si usas un token para autenticación
                }
            })
            .then(response => {
                console.log('Response:', response.data);
    
                // Cerrar mensaje de carga y mostrar mensaje de éxito
                Swal.fire({
                    title: 'Éxito',
                    text: 'La tarjeta se registró correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/user/manageCards');
                });
            })
            .catch(error => {
                console.error('Error:', error);
    
                // Cerrar mensaje de carga y mostrar mensaje de error
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al registrar la tarjeta. Por favor, inténtelo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
        } else {
            alert('Por favor, complete todos los campos correctamente.');
        }
    };
    
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Registrar Nueva Tarjeta</h2>
                </Col>
            </Row>
            <Row className="align-items-center justify-content-center mb-4 mt-2">
                <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                    <Card className="address-card card-design-bank">
                        <Card.Body>
                            <Row>
                                <Col className="text-left">
                                    <img src={chip} alt="Chip" className="chip-image" />
                                </Col>
                                <Col className="text-right">
                                    <img src={visa} alt="Visa" className="visa-image" />
                                </Col>
                            </Row>
                            <div className="bank-card">
                                <Row>
                                    <Row>
                                        <Col className='text-card'>Número de Tarjeta</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card-number'>{cardData.card_number}</Col>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Col className='text-card'>Nombre Propietario</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card-number'>{cardData.card_owner}</Col>
                                    </Row>
                                </Row>
                                <Row>
                                    <Col>
                                        <Col className='text-card'>Tipo de Tarjeta</Col>
                                        <Col className='card-number'>{cardData.card_type}</Col>
                                    </Col>
                                    <Col>
                                        <Col className='text-card'>Código Postal</Col>
                                        <Col className='card-number'>{cardData.card_zip}</Col>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Col className='text-card'>Fecha de Expiración</Col>
                                        <Col className='card-number'>{cardData.card_expiration}</Col>
                                    </Col>
                                    <Col>
                                        <Col className='text-card'>CVV</Col>
                                        <Col className='card-number'>{cardData.card_cvv}</Col>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className='mb-5'>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="formCardNumber">
                            <Form.Label>Número de Tarjeta</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_number"
                                value={cardData.card_number}
                                onChange={handleCardNumberChange}
                                maxLength="19"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardOwner" className="mt-3">
                            <Form.Label>Nombre del Propietario</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_owner"
                                value={cardData.card_owner}
                                onChange={handleInputChange}
                                maxLength={25}
                                isInvalid={!!errors.card_owner}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.card_owner}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formCardType" className="mt-3">
                            <Form.Label>Tipo de Tarjeta</Form.Label>
                            <Form.Control
                                as="select"
                                name="card_type"
                                value={cardData.card_type}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecciona el tipo de tarjeta</option>
                                <option value="Debito">Debito</option>
                                <option value="Credito">Credito</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="formCardZip">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_zip"
                                value={cardData.card_zip}
                                onChange={handleInputChange}
                                maxLength="5"
                                isInvalid={!!errors.card_zip}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.card_zip}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formCardExpiration" className="mt-3">
                            <Form.Label>Fecha de Expiración (MM/AA)</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_expiration"
                                value={cardData.card_expiration}
                                onChange={handleExpirationChange}
                                maxLength="5"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardCvv" className="mt-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_cvv"
                                value={cardData.card_cvv}
                                onChange={handleInputChange}
                                maxLength="3"
                                isInvalid={!!errors.card_cvv}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.card_cvv}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formCardAlias" className="mt-3">
                            <Form.Label>Alias</Form.Label>
                            <Form.Control
                                type="text"
                                name="alias"
                                value={cardData.alias}
                                onChange={handleInputChange}
                                maxLength="30"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Button variant="primary" type="submit" className="mt-4">
                        Registrar Tarjeta
                    </Button>
                </Row>
            </Form>
        </>
    );
}

export default NewCard;
