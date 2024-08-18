import { React, Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap'; // Importa el componente Modal de react-bootstrap
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
    const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal
    const [selectedCard, setSelectedCard] = useState(null); // Estado para la tarjeta seleccionada
    const [editedCardData, setEditedCardData] = useState({});
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
        setEditedCardData({
            id: card.id,
            alias: card.alias,
            card_number: card.card_number,
            card_owner: card.card_owner,
            card_expiration: card.card_expiration,
            card_cvv: card.card_cvv,
            card_type: card.card_type,
            card_zip: card.card_zip,
            Users_id: idUser
        });
        console.log(card)
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleSaveChanges = async () => {
        try {
            console.log('Datos enviados:', editedCardData);
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
            handleCloseModal();
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const handleActive = async (card) => {
        try {
            await axios.patch(
                `https://fm97msirk9.execute-api.us-east-1.amazonaws.com/Prod/toggle_paymentMethod_active/${card.id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Actualizar solo la tarjeta que fue modificada
            setCardsData(cardsData.map(c =>
                c.id === card.id ? { ...c, active: !c.active } : c
            ));
        } catch (error) {
            console.error('Error toggling card active state:', error);
        }
    };

    const handleAliasChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setEditedCardData({ ...editedCardData, alias: value });
        }
    };

    // Validación del número de tarjeta
    const handleCardNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 16) {
            setEditedCardData({ ...editedCardData, card_number: value });
        }
    };

    // Validación del nombre del propietario
    const handleCardOwnerChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 30) {
            setEditedCardData({ ...editedCardData, card_owner: value });
        }
    };

    // Validación del código postal
    const handleCardZipChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 5) {
            setEditedCardData({ ...editedCardData, card_zip: value });
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
                                                        <Button variant="primary" className="responsive-button" onClick={() => handleEdit(card)}>Editar</Button>
                                                    </Col>
                                                    <Col xs={6} className="text-center">
                                                        <Button variant={card.active ? "danger" : "success"} className="responsive-button" onClick={() => handleActive(card)}>
                                                            {card.active ? "Desactivar" : "Activar"}
                                                        </Button>
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
                                                            <Button variant="primary" className="responsive-button" onClick={() => handleEdit(cardsData[index + 1])}>Editar</Button>
                                                        </Col>
                                                        <Col xs={6} className="text-center">
                                                            <Button
                                                                variant={cardsData[index + 1].active ? "danger" : "success"}
                                                                className="responsive-button"
                                                                onClick={() => handleActive(cardsData[index + 1])}
                                                            >
                                                                {cardsData[index + 1].active ? "Desactivar" : "Activar"}
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
                )
            )}

            {/* Modal para editar tarjeta */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
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
                                onChange={handleAliasChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardNumber">
                            <Form.Label>Número de Tarjeta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Número de Tarjeta"
                                value={editedCardData.card_number || ''}
                                onChange={handleCardNumberChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardOwner">
                            <Form.Label>Nombre Propietario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre Propietario"
                                value={editedCardData.card_owner || ''}
                                onChange={handleCardOwnerChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardType">
                            <Form.Label>Tipo de Tarjeta</Form.Label>
                            <Form.Control
                                as="select"
                                value={editedCardData.card_type || ''}
                                onChange={(e) => setEditedCardData({ ...editedCardData, card_type: e.target.value })}
                            >
                                <option value="Débito">Débito</option>
                                <option value="Crédito">Crédito</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formCardZip">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Código Postal"
                                value={editedCardData.card_zip || ''}
                                onChange={handleCardZipChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CardsManageCards;