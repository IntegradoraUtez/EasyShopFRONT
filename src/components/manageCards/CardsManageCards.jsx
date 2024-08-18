import { React, Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [editedCardData, setEditedCardData] = useState({});
    const [loadingEdit, setLoadingEdit] = useState(false);
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

    const handleEdit = (card) => {
        setSelectedCard(card);
        setEditedCardData({ ...card });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSaveChanges = async () => {
        setLoadingEdit(true);
        try {
            await axios.put(
                `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/update_paymentMethod_put`,
                editedCardData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCardsData(cardsData.map(card =>
                card.id === selectedCard.id ? { ...card, ...editedCardData } : card
            ));
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating card:', error);
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleActive = (card) => {
        setSelectedCard(card);
        setShowConfirmationModal(true);
    };

    const handleToggleActivation = async () => {
        setShowConfirmationModal(false);
        try {
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

            setCardsData(cardsData.map(c =>
                c.id === selectedCard.id ? { ...c, active: !c.active } : c
            ));
        } catch (error) {
            console.error('Error toggling card active state:', error);
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
                                            <Col xs={6} className="text-center mb-2">
                                                <Button
                                                    variant="primary"
                                                    className="responsive-button"
                                                    onClick={() => handleEdit(card)}
                                                    disabled={!card.active}
                                                >
                                                    Editar
                                                </Button>
                                            </Col>
                                            <Col xs={6} className="text-center">
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

            {/* Modal para editar tarjeta */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Tarjeta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formAlias">
                            <Form.Label>Alias</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Alias"
                                value={editedCardData.alias || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, alias: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardNumber">
                            <Form.Label>Número de Tarjeta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Número de Tarjeta"
                                value={editedCardData.card_number || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, card_number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardOwner">
                            <Form.Label>Nombre Propietario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre Propietario"
                                value={editedCardData.card_owner || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, card_owner: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardType">
                            <Form.Label>Tipo de Tarjeta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tipo de Tarjeta"
                                value={editedCardData.card_type || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, card_type: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardZip">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Código Postal"
                                value={editedCardData.card_zip || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, card_zip: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveChanges}
                        disabled={loadingEdit}
                    >
                        {loadingEdit ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmación de Activación/Desactivación */}
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
                    <Button
                        variant="primary"
                        onClick={handleToggleActivation}
                    >
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CardsManageCards;
