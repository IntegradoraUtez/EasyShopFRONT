import React from 'react';
import { Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import { BsXCircle } from "react-icons/bs";
import { Link } from 'react-router-dom';
import './styleCarScreen.css';

function CardsCarScreen() {
    const purchaseData = [
        {
            image: "https://i5.walmartimages.com.mx/mg/gm/3pp/asr/4640411c-283d-422a-8719-eb667968d550.5b112f99bb889fa2627f8f311a54dc0d.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            datePurchase: "2024-07-26",
            nameProduct: "Product 1",
            priceProduct: "$10.00",
            totalPurchase: "$10.00",
            discount: 0
        },
        {
            image: "https://pantalonesdemezclilla.mx/cdn/shop/files/tiro-alto-novio-azul-mezclilla-jeans-cintura-simetrica-mujer_8_2cc7ff9a-4287-4817-8665-d2d8e2c99641.jpg?v=1705528720",
            datePurchase: "2024-07-27",
            nameProduct: "Product 2",
            priceProduct: "$20.00",
            totalPurchase: "$20.00",
            discount: 5
        },
        {
            image: "https://pantalonesdemezclilla.mx/cdn/shop/files/tiro-alto-novio-azul-mezclilla-jeans-cintura-simetrica-mujer_8_2cc7ff9a-4287-4817-8665-d2d8e2c99641.jpg?v=1705528720",
            datePurchase: "2024-07-27",
            nameProduct: "Product 3",
            priceProduct: "$20.00",
            totalPurchase: "$20.00",
            discount: 10
        }
    ];

    return (
        <Accordion defaultActiveKey="0" className='mt-3 centered-container'>
            {purchaseData.map((purchase, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{purchase.nameProduct}</Accordion.Header>
                    <Accordion.Body>
                        <Card className="my-3">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={12} md={1} className="text-center my-2">
                                        <Button variant="link">
                                            <Link>
                                                <BsXCircle size={25} />
                                            </Link>
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={3} className="text-center my-2">
                                        <img style={{ height: 120, width: 110 }} src={purchase.image} alt={purchase.nameProduct} />
                                    </Col>
                                    <Col xs={12} md={4} className="text-center my-2 responsive-text">
                                        <Row className="align-items-center">
                                            <Col className="text-center responsive-text">{purchase.nameProduct}</Col>
                                            <Col className="text-center responsive-text">{purchase.priceProduct}</Col>
                                            {purchase.discount > 0 && (
                                                <Col className="text-center text-danger responsive-text">
                                                    {purchase.discount}%
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={3} className="text-center my-2 responsive-text">
                                        <Row className="align-items-center">
                                            <Col className="text-center responsive-text">{purchase.datePurchase}</Col>
                                            <Col className="text-center responsive-text">{purchase.totalPurchase}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default CardsCarScreen;
