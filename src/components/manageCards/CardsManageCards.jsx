import { React, Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import './manageCardsScreen.css';
import { useNavigate } from 'react-router-dom';
import chip from '../../assets/tarjeta-de-credito.png';
import visa from '../../assets/simbolos.png';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

function CardsManageCards() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cardsData, setCardsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
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
            if (!idUser) return;

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
                setCardsData(response.data.paymentMethod || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                setLoading(false);
            }
        };

        if (user && user.user.type === 'user') {
            fetchPaymentMethods();
        }
    }, [user, idUser]);

    const handleInsertNewCard = () => {
        navigate('/user/insertCard');
    };
   
    const handleActive = (card) => {
        setSelectedCard(card);
        setShowConfirmationModal(true);
    };

    const handleToggleActivation = async () => {
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
    
        setShowConfirmationModal(false);
        try {
            // Realizar la petición para cambiar el estado de la tarjeta
            await axios.patch(
                `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/toggle_paymentMethod_active/${selectedCard.id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            // Actualizar el estado de las tarjetas
            setCardsData(cardsData.map(c =>
                c.id === selectedCard.id ? { ...c, active: !c.active } : c
            ));
    
            // Cerrar el mensaje de carga
            Swal.close();
    
            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Éxito',
                text: `La tarjeta ha sido ${selectedCard.active ? 'desactivada' : 'activada'} correctamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error toggling card active state:', error);
            
            // Cerrar el mensaje de carga
            Swal.close();
    
            // Mostrar mensaje de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al cambiar el estado de la tarjeta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
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
                        <Spinner animation="border" variant="primary" />
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
                    <Row>
                        {cardsData.map((card) => (
                            <Col key={card.id} xs={12} md={6} className="mb-4">
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
                                            
                                            <Col xs={12} className="text-center">
                                                <Button
                                                    variant={card.active ? "danger" : "success"}
                                                    className="responsive-button"
                                                    onClick={() => handleActive(card)}
                                                >
                                                    {card.active ? "Desactivar" : "Activar"}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )
            )}

          

            {/* Modal de confirmación para activar/desactivar tarjeta */}
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas {selectedCard?.active ? 'desactivar' : 'activar'} esta tarjeta?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleToggleActivation}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CardsManageCards;
