import { React, Fragment } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './manageCardsScreen.css';
import { useNavigate } from 'react-router-dom';
import chip from '../../assets/tarjeta-de-credito.png'
import visa from '../../assets/simbolos.png'

const CardsData = [
    {
        name: "Tarjeta BBVA",
        cardNumber: "1234 5678 9012 3456",
        ownerName: "Juan Pérez",
        cardType: "Credito",
        postalCode: "12345"
    },
    {
        name: "Tarjeta NU",
        cardNumber: "9876 5432 1098 7654",
        ownerName: "Ana García",
        cardType: "Debito",
        postalCode: "67890"
    },
];

function CardsManageCards() {
    const navigate = useNavigate();

    const handleInsertNewCard = () => {
        navigate('/user/insertCard')
    }


    const handleEdit = (index) => {
        console.log(`Editar tarjeta en índice: ${index}`);
    };

    const handleDelete = (index) => {
        console.log(`Eliminar tarjeta en índice: ${index}`);
    };



    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administracion de tarjetas de Pago</h2>
                </Col>
            </Row>
            <Row className='text-center'>
                <Col>
                    <button className='responsive-button button-insert' onClick={handleInsertNewCard}>Agregar nueva tarjeta de pago</button>
                </Col>
            </Row>

            {CardsData.map((cards, index) => (
                <Fragment key={index}>
                    {index % 2 === 0 && (
                        <Row className="align-items-center justify-content-center mb-4 mt-2">
                            <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                <Card className="address-card card-design">
                                    <Card.Header className="text-center">{cards.name}</Card.Header>
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
                                                        <Row>
                                                            <Col className='text-card'>Número de Tarjeta</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col className='card-number'>{cards.cardNumber}</Col>
                                                        </Row>
                                                        <Row className='mt-2'>
                                                            <Col className='text-card'>Nombre Propietario</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col className='card-number'>{cards.ownerName}</Col>
                                                        </Row>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Col className='text-card'>Típo de Tarjeta</Col>
                                                            <Col className='card-number'>{cards.cardType}</Col>
                                                        </Col>
                                                        <Col>
                                                            <Col className='text-card'>Codígo Postal</Col>
                                                            <Col className='card-number'>{cards.postalCode}</Col>
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
                            {CardsData[index + 1] && (
                                <Col xs={12} md={6} className="justify-content-center">
                                    <Card className="address-card card-design">
                                        <Card.Header className="text-center">{CardsData[index + 1].name}</Card.Header>
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
                                                            <Row>
                                                                <Col className='text-card'>Número de Tarjeta</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className='card-number'>{CardsData[index + 1].cardNumber}</Col>
                                                            </Row>
                                                            <Row className='mt-2'>
                                                                <Col className='text-card'>Nombre Propietario</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className='card-number'>{CardsData[index + 1].ownerName}</Col>
                                                            </Row>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Col className='text-card'>Típo de Tarjeta</Col>
                                                                <Col className='card-number'>{CardsData[index + 1].cardType}</Col>
                                                            </Col>
                                                            <Col>
                                                                <Col className='text-card'>Codígo Postal</Col>
                                                                <Col className='card-number'>{CardsData[index + 1].postalCode}</Col>
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
            ))}

        </>
    );
}

export default CardsManageCards;
