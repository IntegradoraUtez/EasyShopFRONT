import { React, Fragment } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './manageAddressesScreen.css';
import { useNavigate } from 'react-router-dom';

const addressData = [
    {
        name: "Dirección Principal",
        country: "USA",
        state: "California",
        city: "Los Angeles",
        street: "123 Main St",
        postal_code: "90001"
    },
    {
        name: "Dirección Trabajo",
        country: "Canada",
        state: "Ontario",
        city: "Toronto",
        street: "456 Elm St",
        postal_code: "M4B 1B4"
    }
];

function CardsManageAddresses() {
    const navigate = useNavigate();

    const handleInsertAddress = () => {
        navigate('/user/insertAddress')
    }


    const handleEdit = (index) => {
        console.log(`Editar dirección en índice: ${index}`);
    };

    const handleDelete = (index) => {
        console.log(`Eliminar dirección en índice: ${index}`);
    };



    return (
        <>
            <Row className='text-center responsive-title'>
                <Col>
                    <h2>Administracion de Direcciones</h2>
                </Col>
            </Row>
            <Row className='text-center'>
                <Col>
                    <button className='responsive-button button-insert' onClick={handleInsertAddress}>Agregar Dirección</button>
                </Col>
            </Row>

            {addressData.map((address, index) => (
                <Fragment key={index}>
                    {index % 2 === 0 && (
                        <Row className="align-items-center justify-content-center mb-4 mt-2">
                            <Col xs={12} md={6} className="justify-content-center mb-3 mb-md-0">
                                <Card className="address-card card-design">
                                    <Card.Header className="text-center">{address.name}</Card.Header>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col xs={12} md={6} className="text-center my-2">
                                                <p><strong className='responsive-text'>País:</strong> {addressData[index + 1].country}</p>
                                                <p><strong className='responsive-text'>Estado:</strong> {addressData[index + 1].state}</p>
                                                <p><strong className='responsive-text'>Ciudad:</strong> {addressData[index + 1].city}</p>
                                            </Col>
                                            <Col xs={12} md={6} className="text-center my-2">
                                                <p><strong className='responsive-text'>Calle:</strong> {addressData[index + 1].street}</p>
                                                <p><strong className='responsive-text'>Codigo Postal:</strong> {addressData[index + 1].postal_code}</p>
                                            </Col>
                                        </Row>
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
                            {addressData[index + 1] && (
                                <Col xs={12} md={6} className="justify-content-center">
                                    <Card className="address-card card-design">
                                        <Card.Header className="text-center">{addressData[index + 1].name}</Card.Header>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col xs={12} md={6} className="text-center my-2">
                                                    <p><strong className='responsive-text'>País:</strong> {addressData[index + 1].country}</p>
                                                    <p><strong className='responsive-text'>Estado:</strong> {addressData[index + 1].state}</p>
                                                    <p><strong className='responsive-text'>Ciudad:</strong> {addressData[index + 1].city}</p>
                                                </Col>
                                                <Col xs={12} md={6} className="text-center my-2">
                                                    <p><strong className='responsive-text'>Calle:</strong> {addressData[index + 1].street}</p>
                                                    <p><strong className='responsive-text'>Codigo Postal:</strong> {addressData[index + 1].postal_code}</p>
                                                </Col>
                                            </Row>
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

export default CardsManageAddresses;
