import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Dropdown, Form, Modal, Carousel } from 'react-bootstrap';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import '../landing/styleHomeScreen.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function SingleCard({ id, name, active, images, onModify, onToggleActive, onAddImage }) {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3 mb-md-0">
            <div className="w-100">
                {images && images.length > 0 ? (
                    <Carousel className="custom-carousel mt-3">
                        {images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={image.url}
                                    alt={`Slide ${index + 1}`}
                                />
                                <Carousel.Caption>
                                    <h3>{`${name} ${index + 1}`}</h3>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <p className="mt-3">No hay imágenes disponibles</p>
                    </div>
                )}

                <div className="d-flex flex-column mt-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mb-2"
                        onClick={() => onModify(id, name)}
                    >
                        Modificar
                    </Button>
                    <Button
                        variant={active ? "danger" : "success"}
                        size="sm"
                        onClick={onToggleActive}
                    >
                        {active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => onAddImage(id)}
                    >
                        Agregar Imagen
                    </Button>
                </div>
            </div>
        </Col>
    );
}



export default function AdminCategories() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [showActive, setShowActive] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDeactivateModal, setShowConfirmDeactivateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cardsData, setCardsData] = useState([]);
    const [newCategory, setNewCategory] = useState({});
    const [editCategory, setEditCategory] = useState({ id: null, name: '' });

    const [selectedCategoryForImage, setSelectedCategoryForImage] = useState(null);
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [newCategoryImageType, setNewCategoryImageType] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.onloadend = () => {
                setNewCategoryImage(reader.result.split(',')[1]);
                setNewCategoryImageType(file.type.split('/')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadCategoryImage = async (categoryId) => {
        if (!newCategoryImage || !newCategoryImageType) {
            console.error('No se ha seleccionado una imagen.');
            return;
        }

        try {
            console.log("Data: ", newCategoryImage, "type", newCategoryImageType, "id categoria", categoryId);

            const response = await axios.post(
                'https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/upload_category_image',
                {
                    image_data: newCategoryImage,
                    image_category_id: categoryId,
                    image_type: newCategoryImageType
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log('Imagen de la categoría subida con éxito:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Imagen de la categoría subida con éxito',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error al subir la imagen de la categoría:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al subir la imagen',
                text: 'Ocurrió un error al subir la imagen. Inténtalo de nuevo.',
            });
        }
    };

    const [showUploadImageModal, setShowUploadImageModal] = useState(false);

    const handleAddImage = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowUploadImageModal(true);
    };

    useEffect(() => {
        if (!user || user.user.type !== 'admin') {
            navigate('/');
        } else {
            fetchCategories();
        }
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/get_categories', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && Array.isArray(response.data.categories)) {
                const categoriesWithImages = await Promise.all(response.data.categories.map(async (category) => {
                    const imagesResponse = await axios.get(
                        `https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/get_category_images_by_id/${category.id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${user.token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    console.log("imagenes", imagesResponse.data.category);

                    return {
                        ...category,
                        images: imagesResponse.data.category
                    };
                }));

                setCardsData(categoriesWithImages);
            } else {
                console.error("Formato de datos inesperado:", response.data);
            }
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };


    const fetchCategoryImages = async (categoryId) => {
        try {
            const response = await axios.get(`https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/get_category_images_by_id/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && Array.isArray(response.data.category) && response.data.category.length > 0) {
                return response.data.category;
            } else {
                console.warn(`No images found for category ID: ${categoryId}`);
                return [];
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`Category ID: ${categoryId} has no images (404 Not Found)`);
                return [];
            } else {
                console.error('Error fetching category images:', error);
                return [];
            }
        }
    };

    const fetchCategoriesWithImages = async () => {
        try {
            const categoriesResponse = await axios.get('https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/get_categories', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
                const categories = categoriesResponse.data.categories;

                const categoriesWithImagesPromises = categories.map(async (category) => {
                    const images = await fetchCategoryImages(category.id);
                    return { ...category, images };
                });

                const categoriesWithImages = await Promise.all(categoriesWithImagesPromises);
                setCardsData(categoriesWithImages);
            } else {
                console.error("Unexpected data format:", categoriesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (user && user.user.type === 'admin') {
            fetchCategoriesWithImages();
        } else {
            navigate('/');
        }
    }, [user, navigate]);


    const insertCategory = async (categoryData) => {
        try {
            await axios.post(
                'https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/insert_category',
                categoryData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            await fetchCategories();
            setShowAddModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Categoría agregada con éxito',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al agregar la categoría',
                text: 'Ocurrió un error al agregar la categoría. Inténtalo de nuevo.'
            });
        }
    };

    const updateCategory = async (categoryId, categoryData) => {
        try {
            console.log('Datos enviados:', { id_category: categoryId, name: categoryData.name });

            const response = await axios.put(
                `https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/update_category_put`,
                {
                    id: categoryId,
                    name: categoryData.name,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Categoría actualizada con éxito:', response.data);
            await fetchCategories();
            setShowUploadImageModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Categoría actualizada con éxito',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);

            if (error.response) {
                console.error('Datos de error:', error.response.data);
            }

            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar la categoría',
                text: 'Ocurrió un error al actualizar la categoría. Inténtalo de nuevo.'
            });
        }
    };

    const toggleProductActive = async (productId, currentStatus) => {
        const action = currentStatus ? "desactivar" : "activar";
        const confirmButtonText = currentStatus ? "Sí, desactivar" : "Sí, activar";

        const result = await Swal.fire({
            title: `¿Estás seguro de que deseas ${action} esta categoría?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButtonText,
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.patch(
                    `https://alf8xrjokd.execute-api.us-east-1.amazonaws.com/Prod/toggle_category_active/${productId}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(response);

                await fetchCategories();
                Swal.fire({
                    icon: 'success',
                    title: `Categoría ${action}ada con éxito`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: `Error al ${action} la categoría`,
                    text: `Ocurrió un error al ${action} la categoría. Inténtalo de nuevo.`
                });
            }
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleFilterChange = (showActive) => setShowActive(showActive);

    const handleAddCategory = async () => {
        await insertCategory(newCategory);
    };

    const handleModifyCategory = (id, name) => {
        setEditCategory({ id, name });
        setShowEditModal(true);
    };

    const handleEditCategory = async () => {
        await updateCategory(editCategory.id, editCategory);
        setShowEditModal(false);
    };

    const handleDeactivateCategory = () => {
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
        const matchesSearch = card.name && card.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = showActive === null || (showActive ? card.active === 1 : card.active !== 1);
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Row className="mt-2 align-items-center fixed-filters">
                <Col md={6}>
                    <h1>Categorías</h1>
                </Col>
                <Col md={6} className="text-end">
                    

                    <Button onClick={() => setShowAddModal(true)} style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}>
                        Agregar Categoría
                    </Button>
                </Col>
            </Row>

            <Row className="align-items-center justify-content-center mb-4 mt-2">
                {cardsData.map((card, index) => (
                    <SingleCard
                        key={index}
                        id={card.id}
                        name={card.name}
                        active={card.active === 1}
                        images={card.images}
                        onModify={handleModifyCategory}
                        onToggleActive={() => toggleProductActive(card.id, card.active === 1)}
                        onAddImage={handleAddImage}
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
                                value={newCategory.name || ''}
                                onChange={handleInputChange}
                                maxLength={20}
                            />
                        </Form.Group>
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
                                value={editCategory.name}
                                onChange={handleEditInputChange}
                                maxLength={20}
                            />
                        </Form.Group>
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

            <Modal show={showUploadImageModal} onHide={() => setShowUploadImageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Subir Imagen para la Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formCategoryImage">
                        <Form.Label>Seleccionar Imagen</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUploadImageModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => uploadCategoryImage(selectedCategory)}>
                        Subir Imagen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
