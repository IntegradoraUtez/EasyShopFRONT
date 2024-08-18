import { React, Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap'; // Importa el componente Spinner de react-bootstrap
import './manageCardsScreen.css';
import { useNavigate } from 'react-router-dom';
import chip from '../../assets/tarjeta-de-credito.png';
import visa from '../../assets/simbolos.png';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

function CardsManageCards() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cardsData, setCardsData] = useState([]);
    const [loading, setLoading] = useState(true); // Añadido para manejo de carga
    const idUser = user?.user?.id;

    useEffect(() => {
        if (user) {
            if (user.user.type !== 'user') {
                navigate('/');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            if (!idUser) return; // Verifica que el ID del usuario esté disponible

            try {
                const response = await axios.get(
                    `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/get_paymentMethods_by_Usersid/${idUser}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setCardsData(response.data.paymentMethod || []);  // Extraer el array paymentMethod
                setLoading(false); // Terminar la carga
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                setLoading(false); // Terminar la carga en caso de error
            }
        };

        if (user && user.user.type === 'user') {
            fetchPaymentMethods();
        }
    }, [user, idUser]);

    const handleInsertNewCard = () => {
        navigate('/user/insertCard');
    };

    const handleEdit = (index) => {
        console.log(`Editar tarjeta en índice: ${index}`);
    };

    const handleDelete = (index) => {
        console.log(`Eliminar tarjeta en índice: ${index}`);
    };

    if (!user || user.user.type !== 'user') {
        return <h2>No tienes permiso para ver esta página.</h2>;
    }

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administración de Tarjetas de Pago</h2>
                </Col>
            </Row>
            <Row className='text-center'>
                <Col>
                    <button className='responsive-button button-insert' onClick={handleInsertNewCard}>Agregar nueva tarjeta de pago</button>
                </Col>
            </Row>

            {loading ? (
                <Row className="justify-content-center mt-4">
                    <Col className="text-center">
                        <Spinner animation="border" variant="primary" /> {/* Spinner de carga */}
                    </Col>
                </Row>
            ) : (
                cardsData.length === 0 ? (
                    <Row className="justify-content-center mt-4">
                        <Col className="text-center">
                            <h2>No hay datos disponibles.</h2>
                        </Col>
                    </Row>
                ) : (
                    cardsData.map((card, index) => (
                        <Fragment key={index}>
                            {index % 2 === 0 && (
                                <Row className="align-items-center justify-content-center mb-4 mt-2">
                                    <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                        <Card className="address-card card-design">
                                            <Card.Header className="text-center">{card.alias}</Card.Header>
                                            <Card.Body>
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
                                                                <Col>
                                                                    <Row>
                                                                        <Col className='text-card'>Número de Tarjeta</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='card-number'>{card.card_number}</Col>
                                                                    </Row>
                                                                    <Row className='mt-2'>
                                                                        <Col className='text-card'>Nombre Propietario</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='card-number'>{card.card_owner}</Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col>
                                                                    <Row>
                                                                        <Col className='text-card'>Tipo de Tarjeta</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='card-number'>{card.card_type}</Col>
                                                                    </Row>
                                                                    <Row className='mt-2'>
                                                                        <Col className='text-card'>Código Postal</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className='card-number'>{card.card_zip}</Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
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
                                    {cardsData[index + 1] && (
                                        <Col xs={12} md={6} className="justify-content-center">
                                            <Card className="address-card card-design">
                                                <Card.Header className="text-center">{cardsData[index + 1].alias}</Card.Header>
                                                <Card.Body>
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
                                                                    <Col>
                                                                        <Row>
                                                                            <Col className='text-card'>Número de Tarjeta</Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col className='card-number'>{cardsData[index + 1].card_number}</Col>
                                                                        </Row>
                                                                        <Row className='mt-2'>
                                                                            <Col className='text-card'>Nombre Propietario</Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col className='card-number'>{cardsData[index + 1].card_owner}</Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col className='text-card'>Tipo de Tarjeta</Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col className='card-number'>{cardsData[index + 1].card_type}</Col>
                                                                        </Row>
                                                                        <Row className='mt-2'>
                                                                            <Col className='text-card'>Código Postal</Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col className='card-number'>{cardsData[index + 1].card_zip}</Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
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
                    ))
                )
            )}
        </>
    );
}

export default CardsManageCards;
