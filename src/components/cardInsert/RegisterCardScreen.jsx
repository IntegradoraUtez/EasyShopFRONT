import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import './registerCardScreen.css';
import { useNavigate } from 'react-router-dom';
import chip from '../../assets/tarjeta-de-credito.png';
import visa from '../../assets/simbolos.png';
import {
    FuncionNumeroTarjeta,
    FuncionIdentificarTipoTarjeta,
    FuncionVerificarVencimientoFecha,
    FuncionFormatMesAño,
} from './validaciones';

function NewCard() {

    const navigate = useNavigate();

    const handleInsertCard = () => {
        navigate('/user/insertCard')
    }
    const [cardData, setCardData] = useState({
        alias: "Nueva Tarjeta",
        card_number: "",
        card_owner: "",
        card_type: "",
        card_zip: "",
        card_expiration: "",
        card_cvv: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardData({
            ...cardData,
            [name]: value,
        });
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
        const expirationError = FuncionVerificarVencimientoFecha(cardData.card_expiration);
        if (expirationError) {
            alert(expirationError);
        } else {
            // Process the card data
            console.log('Card Data:', cardData);
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
                                    <img src="" alt="Chip" className="chip-image" />
                                </Col>
                                <Col className="text-right">
                                    <img src="" alt="Visa" className="visa-image" />
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
            <Form onSubmit={handleSubmit} className='mb-5'>
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
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardType" className="mt-3">
                            <Form.Label>Tipo de Tarjeta</Form.Label>
                            <Form.Control
                                as="select"
                                name="card_type"
                                value={cardData.card_type}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                                <option value="Debito">Debito</option>
                                <option value="Credito">Credito</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="formCardZip" >
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                name="card_zip"
                                value={cardData.card_zip}
                                onChange={handleInputChange}
                            />
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
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>

                    <Button variant="primary" type="submit" className="mt-4" onClick={handleInsertCard}>
                        Registrar Tarjeta
                    </Button>
                </Row>
            </Form>
        </>
    );
}

export default NewCard;
