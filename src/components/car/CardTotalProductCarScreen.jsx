import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './styleCarScreen.css';
import { useAuth } from '../../context/AuthContext';

function CardTotalProductCarScreen() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const { user } = useAuth();
    const userId = user.user.id;

    useEffect(() => {
        // Recuperar los datos del carrito desde localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCart);

        // Obtener métodos de pago del usuario
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get(
                    `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/get_paymentMethods_by_Usersid/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`
                        }
                    }
                );
                setPaymentMethods(response.data.paymentMethod || []);
            } catch (error) {
                console.error('Error al obtener los métodos de pago:', error);
            }
        };

        // Obtener direcciones del usuario
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(
                    `https://qj6gmqce78.execute-api.us-east-1.amazonaws.com/Prod/get_addresses_by_Usersid/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`
                        }
                    }
                );
                setAddresses(response.data.addresses || []);
            } catch (error) {
                console.error('Error al obtener las direcciones:', error);
            }
        };

        fetchAddresses();
        fetchPaymentMethods();
    }, [userId, user?.token]);

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

    // Manejar la compra
    const handleButtonBuy = async () => {
        // Validar que se hayan seleccionado todos los datos necesarios
        if (!selectedPaymentMethod || !selectedAddress) {
            Swal.fire({
                title: 'Datos incompletos',
                text: 'Por favor selecciona un método de pago y una dirección de envío antes de realizar la compra.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Mostrar spinner de carga
        Swal.fire({
            title: 'Procesando la compra...',
            text: 'Por favor espera mientras procesamos tu compra',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const purchaseData = {
                totalPrice: totalAfterDiscount(),
                datetime: new Date().toISOString(),
                users_id: userId,
                paymentMethod_id: selectedPaymentMethod,
                address_id: selectedAddress,
                products: cartItems.map(item => ({ id: item.id }))
            };

            const response = await axios.post(
                'https://u5cudf8m2b.execute-api.us-east-1.amazonaws.com/Prod/insert_purchase',
                purchaseData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    }
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: '¡Compra exitosa!',
                    text: 'Tu compra ha sido realizada con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/');
                    localStorage.removeItem('cartItems');
                });
            } else {
                throw new Error('Error en la compra');
            }
        } catch (error) {
            // Ocultar el spinner y mostrar la alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al realizar la compra. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al realizar la compra:', error);
        }
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
                            <Form.Select
                                aria-label="Selecciona una tarjeta"
                                className='mb-2'
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            >
                                <option value=''>Selecciona una tarjeta</option>
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
                            <Form.Select
                                aria-label="Selecciona una dirección de envío"
                                className='mb-2'
                                onChange={(e) => setSelectedAddress(e.target.value)}
                            >
                                <option value=''>Selecciona una dirección de envío</option>
                                {addresses.filter(address => address.active === 1).map((address, index) => (
                                    <option key={index} value={address.id}>
                                        {address.name} - {address.city},{address.country},{address.postal_code}
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
