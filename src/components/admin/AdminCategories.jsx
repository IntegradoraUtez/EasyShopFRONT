import React, { useState } from 'react';
import { Card, Carousel, Col, Row, Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import '../landing/styleHomeScreen.css'; // Asegúrate de ajustar la ruta al archivo de estilos según tu estructura de proyecto

function SingleCardWithCarousel({ categoria, images, onModify, onDeactivate }) {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3 mb-md-0">
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
                        <Card.Title className="responsive-text-card">{categoria}</Card.Title>
                        <div className="d-flex flex-column mt-2">
                            <Button variant="secondary" size="sm" className="mb-2" onClick={onModify}>Modificar</Button>
                            <Button variant="danger" size="sm" onClick={onDeactivate}>Desactivar</Button>
                        </div>
                    </Col>
                </Card.ImgOverlay>
            </Card>
        </Col>
    );
}

export default function AdminCategories() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showActive, setShowActive] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', images: ['', '', ''] });

    const cardsData = [
        {
            categoria: 'Administrar Categorias',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        },
        {
            categoria: 'Administrar Productos',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        },
        {
            categoria: 'Administrar Usuarios',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: false
        },
        {
            categoria: 'Historial de Compras',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        }
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (showActive) => {
        setShowActive(showActive);
    };

    const handleAddCategory = () => {
        // Lógica para agregar la categoría
        console.log('Agregar categoría', newCategory);
        setShowAddModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const filteredCardsData = cardsData.filter(card => {
        const matchesSearch = card.categoria.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = showActive ? card.active : !card.active;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Row className="mt-2 align-items-center fixed-filters">
                <Col md={6}>
                    <h1>Categorías</h1>
                </Col>
                <Col md={6} className="text-end">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ display: 'inline-block', width: 'auto', marginRight: '8px' }}
                    />
                    <Dropdown as="div" style={{ display: 'inline-block', marginRight: '8px' }}>
                        <Dropdown.Toggle style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}>
                            Filtros <HiAdjustmentsHorizontal />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleFilterChange(null)}>Todos</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterChange(true)}>Activos</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterChange(false)}>Desactivados</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button onClick={() => setShowAddModal(true)} style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}>
                        Agregar Categoría
                    </Button>
                </Col>
            </Row>

            <Row className="align-items-center justify-content-center mb-4 mt-2">
                {filteredCardsData.map((card, index) => (
                    <SingleCardWithCarousel
                        key={index}
                        categoria={card.categoria}
                        images={card.images}
                        onModify={() => console.log(`Modificar ${card.categoria}`)}
                        onDeactivate={() => console.log(`Desactivar ${card.categoria}`)}
                    />
                ))}
            </Row>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Nombre de la Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre de la Categoría"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {newCategory.images.map((image, index) => (
                            <Form.Group controlId={`formCategoryImage${index}`} key={index}>
                                <Form.Label>URL de la Imagen {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`URL de la Imagen ${index + 1}`}
                                    name={`image${index}`}
                                    value={image}
                                    onChange={(e) => {
                                        const images = [...newCategory.images];
                                        images[index] = e.target.value;
                                        setNewCategory({ ...newCategory, images });
                                    }}
                                />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Agregar Categoría
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
