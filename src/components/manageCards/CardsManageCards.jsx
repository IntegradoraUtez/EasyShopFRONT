import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function CardsManageCards() {
    const { user } = useAuth();
    const [cardsData, setCardsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(null);
    const [newCard, setNewCard] = useState({
        name: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
    });

    // CORS headers configuration
    const corsHeaders = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        axios.get('https://your-api-url.com/get_cards', { headers: corsHeaders })
            .then(response => {
                setCardsData(response.data.cards || []);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
            });
    }, [user.token]);

    const handleInsertCard = () => {
        setIsEditing(false);
        setNewCard({
            name: '',
            country: '',
            state: '',
            city: '',
            street: '',
            postal_code: ''
        });
        setShowModal(true);
    };

    const handleEdit = (index) => {
        setIsEditing(true);
        setCurrentCardIndex(index);
        setNewCard(cardsData[index]);
        setShowModal(true);
    };

    const handleSaveCard = async () => {
        const url = isEditing
            ? 'https://your-api-url.com/update_card'
            : 'https://your-api-url.com/insert_card';

        const method = isEditing ? 'put' : 'post';
        const cardPayload = { ...newCard };

        try {
            const response = await axios({
                method,
                url,
                data: cardPayload,
                headers: corsHeaders
            });

            if (isEditing) {
                const updatedCards = [...cardsData];
                updatedCards[currentCardIndex] = response.data;
                setCardsData(updatedCards);
            } else {
                setCardsData(prevCards => [...prevCards, response.data]);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const handleDelete = (index) => {
        setSelectedCardIndex(index);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const id = cardsData[selectedCardIndex].id;
        try {
            await axios.delete(`https://your-api-url.com/delete_card/${id}`, { headers: corsHeaders });
            const updatedCards = cardsData.filter((_, i) => i !== selectedCardIndex);
            setCardsData(updatedCards);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const handleActive = async (card) => {
        try {
            await axios.patch(
                `https://your-api-url.com/toggle_card_active/${card.id}`,
                {},
                {
                    headers: corsHeaders
                }
            );

            setCardsData(cardsData.map(c =>
                c.id === card.id ? { ...c, active: c.active === 0 ? 1 : 0 } : c
            ));
        } catch (error) {
            console.error('Error toggling card active state:', error);
        }
    };

    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administración de Tarjetas</h2>
                </Col>
            </Row>

            {user.user?.type === 'admin' && (
                <>
                    <Row className='text-center'>
                        <Col>
                            <Button className='responsive-button button-insert' onClick={handleInsertCard}>Agregar Tarjeta</Button>
                        </Col>
                    </Row>

                    {Array.isArray(cardsData) && cardsData.length > 0 ? (
                        cardsData.map((card, index) => (
                            <Fragment key={index}>
                                {card.active === 1 && (
                                    <Row className="align-items-center justify-content-center mb-4 mt-2">
                                        <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                            <Card className="card-design">
                                                <Card.Header className="text-center">{card.name}</Card.Header>
                                                <Card.Body>
                                                    <Row className="align-items-center">
                                                        <Col xs={12} md={6} className="text-center my-2">
                                                            <p><strong className='responsive-text'>País:</strong> {card.country}</p>
                                                            <p><strong className='responsive-text'>Estado:</strong> {card.state}</p>
                                                            <p><strong className='responsive-text'>Ciudad:</strong> {card.city}</p>
                                                        </Col>
                                                        <Col xs={12} md={6} className="text-center my-2">
                                                            <p><strong className='responsive-text'>Calle:</strong> {card.street}</p>
                                                            <p><strong className='responsive-text'>Código Postal:</strong> {card.postal_code}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="justify-content-center mt-3">
                                                        <Col xs={6} className="text-center mb-2">
                                                            {card.active === 1 && (
                                                                <Button variant="primary" className="responsive-button" onClick={() => handleEdit(index)}>Editar</Button>
                                                            )}
                                                        </Col>
                                                        <Col xs={6} className="text-center mb-2">
                                                            <Button
                                                                variant={card.active === 1 ? "danger" : "success"}
                                                                className="responsive-button"
                                                                onClick={() => handleActive(card)}
                                                            >
                                                                {card.active === 1 ? "Desactivar" : "Activar"}
                                                            </Button>
                                                        </Col>
                                                        <Col xs={6} className="text-center mb-2">
                                                            <Button variant="danger" className="responsive-button" onClick={() => handleDelete(index)}>Eliminar</Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <Row className="text-center">
                            <Col>
                                <p>No hay tarjetas disponibles.</p>
                            </Col>
                        </Row>
                    )}
                </>
            )}

            {/* Modal para insertar y editar tarjeta */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Tarjeta' : 'Agregar Tarjeta'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCardName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newCard.name}
                                onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                                placeholder="Nombre"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardCountry">
                            <Form.Label>País</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={newCard.country}
                                onChange={e => setNewCard({ ...newCard, country: e.target.value })}
                                placeholder="País"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardState">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={newCard.state}
                                onChange={e => setNewCard({ ...newCard, state: e.target.value })}
                                placeholder="Estado"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardCity">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={newCard.city}
                                onChange={e => setNewCard({ ...newCard, city: e.target.value })}
                                placeholder="Ciudad"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardStreet">
                            <Form.Label>Calle</Form.Label>
                            <Form.Control
                                type="text"
                                name="street"
                                value={newCard.street}
                                onChange={e => setNewCard({ ...newCard, street: e.target.value })}
                                placeholder="Calle"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardPostalCode">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                name="postal_code"
                                value={newCard.postal_code}
                                onChange={e => setNewCard({ ...newCard, postal_code: e.target.value })}
                                placeholder="Código Postal"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleSaveCard}>
                        {isEditing ? 'Guardar Cambios' : 'Agregar Tarjeta'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar esta tarjeta?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CardsManageCards;
