import { React, Fragment } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './styleHomeScreen.css';

function CardsCategoryHome() {

    const categorias = [
        {
            categoria: 'Jeans',
            imagen: 'https://cocoajeans.com.co/cdn/shop/articles/jeans_870x.png?v=1611623964'
        },
        {
            categoria: 'Blusas',
            imagen: 'https://i.pinimg.com/736x/2e/87/3d/2e873d0c26ae41d4eeb49a11d2ce36a1.jpg'
        },
        {
            categoria: 'Jackets',
            imagen: 'https://ss545.liverpool.com.mx/xl/1127971273.jpg'
        },
        {
            categoria: 'Pants',
            imagen: 'https://salvajetentacion.mx/cdn/shop/files/3cc6d571-a106-4e8b-88bf-48ef6f4b034c_2048x2048.jpg?v=1718181567'
        },
        {
            categoria: 'Shorts',
            imagen: 'https://i.pinimg.com/564x/14/4e/26/144e26c0bcce43eb12ff83518188b87d.jpg'
        },
        {
            categoria: 'Tenis',
            imagen: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/396172/01/mod02/fnd/PNA/fmt/png/Tenis-Mujer-CA-Pro-Classic'
        }
    ];
    
    return (
        <>
            {categorias.map((item, index) => (
                <Fragment key={index}>
                    {index % 2 === 0 && (
                        <Row className="align-items-center justify-content-center mb-4 mt-2">
                            <Col xs={12} md={6} className="d-flex justify-content-center mb-3 mb-md-0">
                                <Card className="product-card">
                                    <Card.Img variant="top" src={item.imagen} />
                                    <Card.ImgOverlay className="card-overlay">
                                        <Col className="textCard">
                                            <Card.Title className="responsive-text-card">{item.categoria}</Card.Title>
                                            <button className='button-product-category responsive-button'>Comprar</button>
                                        </Col>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                            {categorias[index + 1] && (
                                <Col xs={12} md={6} className="d-flex justify-content-center">
                                    <Card className="product-card">
                                        <Card.Img variant="top" src={categorias[index + 1].imagen} />
                                        <Card.ImgOverlay className="card-overlay">
                                            <Col className="textCard">
                                                <Card.Title className="responsive-text-card">{categorias[index + 1].categoria}</Card.Title>
                                                <button className='button-product-category responsive-button'>Comprar</button>
                                            </Col>
                                        </Card.ImgOverlay>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )}
                </Fragment>
            ))}
        </>
    )
}

export default CardsCategoryHome;
