import React from 'react';
import { Card, Carousel, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function AdminCategories() {
    const images = [
        'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
        'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
        'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
    ];

    const categoria = {
        categoria: 'Administrar Categorias',
        enlace: '/admin/categories'
    };

    return (
        <Col xs={12} md={6} className="d-flex justify-content-center mb-3 mb-md-0">
            <Card className="product-card mt-3">
                <Carousel interval={2000}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={image}
                                alt={`Slide ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                <Card.ImgOverlay className="card-overlay">
                    <Col className="textCard">
                        <Card.Title className="responsive-text-card">{categoria.categoria}</Card.Title>
                        <Link to={categoria.enlace}>
                            <button className='button-product-category responsive-button'>Ingresar</button>
                        </Link>
                    </Col>
                </Card.ImgOverlay>
            </Card>
        </Col>
    );
}
