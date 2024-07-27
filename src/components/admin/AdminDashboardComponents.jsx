import { React, Fragment } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import '../landing/styleHomeScreen.css';
import { Link } from 'react-router-dom';

function AdminDashboardComponents() {
    const categorias = [
        {
            categoria: 'Administrar Productos',
            imagen: 'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
            enlace: '/admin/productos'
        },
        {
            categoria: 'Administrar Usuarios',
            imagen: 'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
            enlace: '/admin/usuarios'
        },
        {
            categoria: 'Administrar Categorias',
            imagen: 'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg',
            enlace: '/admin/categorias'
        },
        {
            categoria: 'Historial de Compras',
            imagen: 'https://uvn-brightspot.s3.amazonaws.com/assets/vixes/btg/tech.batanga.com/files/Cinco-excelentes-sitios-para-comprar-ropa-y-accesorios-1.jpg',
            enlace: '/admin/historial'
        }
    ];

    return (
        <Row className="align-items-center justify-content-center mb-4 mt-2">
            {categorias.map((item, index) => (
                <Col key={index} xs={12} md={6} className="d-flex justify-content-center mb-3 mb-md-0">
                    <Card className="product-card mt-3">
                        <Card.Img variant="top" src={item.imagen} />
                        <Card.ImgOverlay className="card-overlay">
                            <Col className="textCard">
                                <Card.Title className="responsive-text-card">{item.categoria}</Card.Title>
                                <Link to={item.enlace}>
                                    <button className='button-product-category responsive-button'>Ingresar</button>
                                </Link>
                            </Col>
                        </Card.ImgOverlay>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default AdminDashboardComponents;
