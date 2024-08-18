import React, { useState, useEffect } from 'react';
import { Card, Carousel, Col, Row, Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import '../landing/styleHomeScreen.css'; // Asegúrate de ajustar la ruta al archivo de estilos según tu estructura de proyecto
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';



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
    const {user} = useAuth();
    const navigate = useNavigate;
    
    useEffect(() => {
        if (!user || user.user.type !== 'admin') {
            navigate('/'); 
        } else {
            console.log('Tipo:', user.user.type);
            console.log('Token:', user.token);
        }

    }, [user, navigate]);



    const [searchTerm, setSearchTerm] = useState('');
    const [showActive, setShowActive] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDeactivateModal, setShowConfirmDeactivateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ categoria: '', images: ['', '', ''] });
    const [editCategory, setEditCategory] = useState({ id: null, categoria: '', images: ['', '', ''] });


    const cardsData = [
        {
            categoria: 'Jeans',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        },
        {
            categoria: 'Jackets',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        },
        {
            categoria: 'Pans',
            images: [
                'https://images.ecestaticos.com/j8exM3G00FKxNOsdok9_oL99m8Q=/0x0:2119x1415/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F21c%2F586%2F696%2F21c5866968158e56bf258a48a5e3053b.jpg',
                'https://png.pngtree.com/thumb_back/fw800/background/20220817/pngtree-stylish-woman-shops-for-clothes-with-credit-card-happy-and-smiling-photo-image_48164174.jpg',
                'https://uploads-ssl.webflow.com/626c39fe1ac567f4c6aacbfe/629544f029afea99b3d7204e_628eaf05aeaf96563e150330_aumentar-ventas-en-tu-tienda-de-ropa.jpeg'
            ],
            active: true
        },
        {
            categoria: 'Blusas',
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

    const handleEditCategory = () => {
        // Lógica para editar la categoría
        console.log('Editar categoría', editCategory);
        setShowEditModal(false);
    };

    const handleDeactivateCategory = () => {
        // Lógica para desactivar la categoría
        console.log('Desactivar categoría', selectedCategory);
        setShowConfirmDeactivateModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCategory({ ...editCategory, [name]: value });
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
                        onModify={() => {
                            setEditCategory(card);
                            setShowEditModal(true);
                        }}
                        onDeactivate={() => {
                            setSelectedCategory(card.categoria);
                            setShowConfirmDeactivateModal(true);
                        }}
                    />
                ))}
            </Row>

            {/* Modal para Agregar Categoría */}
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
                                value={newCategory.name || ''}
                                onChange={handleInputChange}
                                maxLength={20}
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

            {/* Modal para Editar Categoría */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEditCategoryName">
                            <Form.Label>Nombre de la Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre de la Categoría"
                                name="name"
                                value={editCategory.categoria}
                                onChange={handleEditInputChange}
                                maxLength={20}
                            />
                        </Form.Group>
                        {editCategory.images.map((image, index) => (
                            <Form.Group controlId={`formEditCategoryImage${index}`} key={index}>
                                <Form.Label>URL de la Imagen {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`URL de la Imagen ${index + 1}`}
                                    name={`image${index}`}
                                    value={image}
                                    onChange={(e) => {
                                        const images = [...editCategory.images];
                                        images[index] = e.target.value;
                                        setEditCategory({ ...editCategory, images });
                                    }}
                                />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleEditCategory}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmación para Desactivar */}
            <Modal show={showConfirmDeactivateModal} onHide={() => setShowConfirmDeactivateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Desactivación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas desactivar la categoría "{selectedCategory}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDeactivateModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeactivateCategory}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
