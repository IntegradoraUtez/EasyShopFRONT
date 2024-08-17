import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import './styleCarScreen.css';
import { Link, useNavigate } from 'react-router-dom';

function CardTotalProductCarScreen() {
    const navigate = useNavigate();

    const handleButtonBuy = () => {
        navigate('')
    }

    return (
        <div className="centered-container">
            <Card className="my-3">
                <Card.Header className="text-center">Detalle de Compra</Card.Header>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center mt-2">Producto</Col>
                            <Col className="text-center mt-2">Descuento</Col>
                        </Col>
                        <Col className="text-center my-2">
                            <Col className="text-center">$ 2000</Col>
                            <Col className="text-center mt-2">$ 1000</Col>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Total</Col>
                        </Col>
                        <Col className="text-center my-2">
                            <Col className="text-center">$ 1000</Col>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <button className='button-product-category responsive-button' onClick={handleButtonBuy}>Comprar</button>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Selecciona una Tarjeta para la compra</Col>
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Form.Select aria-label="Default select example"  className='mb-2'>
                                <option>Selecciona una tarjeta</option>
                                <option value="1">Tarjeta BBVA</option>
                                <option value="2">Tarjeta Nu</option>
                                <option value="3">Tarjeta Banco Azteca</option>
                            </Form.Select>
                            <Link to="/user/insertCard" className="custom-link">Agregar nueva Tarjeta</Link>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Selecciona una Direccion de envio</Col>
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Form.Select aria-label="Default select example" className='mb-2'>
                                <option>Selecciona una dirección de envío</option>
                                <option value="1">Dirección Principal</option>
                                <option value="2">Dirección Trabajo</option>
                            </Form.Select>
                            <Link to="/user/manageAddresses" className="custom-link">Agregar nueva Dirección</Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}

export default CardTotalProductCarScreen;
