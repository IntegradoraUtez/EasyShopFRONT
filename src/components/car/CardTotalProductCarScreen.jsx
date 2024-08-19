import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styleCarScreen.css';
import { useAuth } from '../../context/AuthContext';

function CardTotalProductCarScreen() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const { user } = useAuth();
    const userId = user.user.id;

    useEffect(() => {
        // Recuperar los datos del carrito desde localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log('Carrito recuperado:', storedCart); // Verificar los datos del carrito
        setCartItems(storedCart);

        // Obtener métodos de pago del usuario
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get(
                    `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/get_paymentMethods_by_Usersid/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}` // Reemplaza con el token si es necesario
                        }
                    }
                );
                setPaymentMethods(response.data.paymentMethod || []);
                console.log(response.data.paymentMethod)
            } catch (error) {
                console.error('Error al obtener los métodos de pago:', error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const response = await axios.get(
                    `https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_addresses_by_Usersid/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}` // Reemplaza con el token si es necesario
                        }
                    }
                );
                setAddresses(response.data.addresses || []);
                console.log(response.data)
            } catch (error) {
                console.error('Error al obtener los métodos de pago:', error);
            }
        }

        fetchAddresses();
        fetchPaymentMethods();
    }, [userId]);

    // Calcular el total antes del descuento
    const calculateTotalBeforeDiscount = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    // Calcular el total de los descuentos aplicados a cada producto
    const calculateTotalDiscount = () => {
        return cartItems.reduce((total, item) => {
            const discountAmount = (item.price * (item.discount || 0)) / 100;
            return total + discountAmount;
        }, 0);
    };

    // Calcular el total después del descuento
    const totalAfterDiscount = () => {
        const totalBeforeDiscount = calculateTotalBeforeDiscount();
        const totalDiscount = calculateTotalDiscount();
        return totalBeforeDiscount - totalDiscount;
    };

    const handleButtonBuy = () => {
        // Lógica para procesar la compra
        navigate('/purchase-confirmation'); // Redirige a una página de confirmación
    };

    return (
        <div className="centered-container">
            <Card className="my-3">
                <Card.Header className="text-center">Detalle de Compra</Card.Header>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Producto</Col>
                            <Col className="text-center">Descuento</Col>
                        </Col>
                        <Col className="text-center my-2">
                            <Col className="text-center">${calculateTotalBeforeDiscount().toFixed(2)}</Col>
                            <Col className="text-center mt-2">-${calculateTotalDiscount().toFixed(2)}</Col>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Total</Col>
                        </Col>
                        <Col className="text-center my-2">
                            <Col className="text-center">${totalAfterDiscount().toFixed(2)}</Col>
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
                            <Form.Select aria-label="Default select example" className='mb-2'>
                                <option>Selecciona una tarjeta</option>
                                {paymentMethods.filter(method => method.active === 1).map((method, index) => (
                                    <option key={index} value={method.id}>
                                        {method.alias} (**** {method.card_number.slice(-4)})
                                    </option>
                                ))}
                            </Form.Select>
                            <Link to="/user/insertCard" className="custom-link">Agregar nueva Tarjeta</Link>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Col className="text-center">Selecciona una Dirección de Envío</Col>
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col className="text-center my-2">
                            <Form.Select aria-label="Default select example" className='mb-2'>
                                <option>Selecciona una dirección de envío</option>
                                {addresses.filter(method => method.active === 1).map((method, index) => (
                                    <option key={index} value={method.id}>
                                        {method.name} - {method.city},{method.country},{method.postal_code}
                                    </option>
                                ))}
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
