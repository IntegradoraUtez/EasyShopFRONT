import React, { useState, Fragment, useEffect } from 'react';
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import '../landing/styleHomeScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function AdminDashboardComponents() {

    const {user} = useAuth();

    //JSON
    /*
    token = toooodo token PETICIONES
    user: {
        "active": 1,
        "birthdate": "2001-06-20",
        "email": "20193tn142@utez.edu.mx",
        "gender": "Masculino",
        "id": 18,
        "lastname": "valencia",
        "name": "darien",
        "password": "$2b$12$qL7l939qIXM2FKiaTFPOK.gtBK6mtFm1ReFtL/VOefltgyVGTp66.",
        "type": "admin",
        "username": "darien"
    }

    const estado = user.active
*/
const navigate = useNavigate;
    
useEffect(() => {
    if (!user || user.user.type !== 'admin') {
        navigate('/'); 
    } else {
        console.log('Tipo:', user.user.type);
        console.log('Token:', user.token);
    }

}, [user, navigate]);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        image: ''
    });

    const handleCategoryShow = () => setShowCategoryModal(true);
    const handleCategoryClose = () => setShowCategoryModal(false);

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleAddCategory = () => {
        // Lógica para agregar una categoría
        console.log('Agregar categoría', newCategory);
        handleCategoryClose();
    };

    const categorias = [
        {
            categoria: 'Administrar Productos',
            imagen: 'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
            enlace: '/admin/products'
        },
        {
            categoria: 'Administrar Usuarios',
            imagen: 'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
            enlace: '/admin/users'
        },
        {
            categoria: 'Administrar Categorias',
            imagen: 'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg',
            enlace: '/admin/category'
        },
        {
            categoria: 'Historial de Compras',
            imagen: 'https://uvn-brightspot.s3.amazonaws.com/assets/vixes/btg/tech.batanga.com/files/Cinco-excelentes-sitios-para-comprar-ropa-y-accesorios-1.jpg',
            enlace: '/admin/purchases'
        }
    ];

    return (
        <Fragment>
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

            <Modal show={showCategoryModal} onHide={handleCategoryClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Administrar Categorías</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Nombre de la Categoría</Form.Label>
                            <Form.Control type="text" placeholder="Nombre de la Categoría" name="name" value={newCategory.name} onChange={handleCategoryInputChange} />
                        </Form.Group>
                        <Form.Group controlId="formCategoryImage">
                            <Form.Label>URL de la Imagen</Form.Label>
                            <Form.Control type="text" placeholder="URL de la Imagen" name="image" value={newCategory.image} onChange={handleCategoryInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCategoryClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Agregar Categoría
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default AdminDashboardComponents;
