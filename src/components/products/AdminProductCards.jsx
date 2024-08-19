import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Dropdown, Modal, Form } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import './ProductsCard.css'; // Asegúrate de tener un archivo CSS para los estilos adicionales
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function ProductsCard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    const [selectedImageProduct, setSelectedImageProduct] = useState(null);
    const showLoading = () => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };
    
    const closeLoading = () => {
        Swal.close();
    };



    const handleEditImageShow = (product) => {
        setSelectedImageProduct(product);
        setShowEditImageModal(true);
    };

    const handleEditImageClose = () => setShowEditImageModal(false);

    const handleUploadImage = async () => {
        if (!selectedImageProduct || !newProduct.image_data || !newProduct.image_type) {
            console.error('No se ha seleccionado una imagen o producto.');
            return;
        }
    
        showLoading();
    
        try {
            const response = await axios.post(
                'https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/upload_product_image',
                {
                    image_data: newProduct.image_data, 
                    image_name_id: selectedImageProduct.id,  
                    image_type: newProduct.image_type,       
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            closeLoading();
    
            Swal.fire({
                icon: 'success',
                title: 'Imagen del producto actualizada con éxito',
                showConfirmButton: false,
                timer: 1500
            });
    
            handleEditImageClose();
        } catch (error) {
            closeLoading();
            console.error('Error al subir la imagen:', error);
            if (error.response) {
                console.error('Datos de error:', error.response.data);
                console.error('Estado del error:', error.response.status);
            }
            Swal.fire({
                icon: 'error',
                title: 'Error al subir la imagen',
                text: 'Ocurrió un error al subir la imagen. Inténtalo de nuevo.'
            });
        }
    };
    
    

    useEffect(() => {
        if (!user || user.user.type !== 'admin') {
            navigate('/');
        }
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/get_products');

                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    console.error("Formato de datos inesperado:", response.data);
                }
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
        fetchProducts();

    }, [user, navigate]);

    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        stock: 0,
        image_data: '',
        image_type: '',
        category_id: ''
    });

    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => {
        setNewProduct({
            name: '',
            description: '',
            price: 0,
            discount: 0,
            stock: 0,
            image_data: '',
            image_type: '',
            category_id: ''
        });
        setShowAddModal(true);
    };

    const handleEditClose = () => setShowEditModal(false);

    const handleEditShow = (product) => {
        setSelectedProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            category_id: product.category_id
        });
        setShowEditModal(true);
    };

    const handleAddProduct = async () => {
        showLoading();
    
        try {
            await insertProduct(newProduct);
            setProducts([...products, newProduct]);
    
            closeLoading();
    
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
    
            handleAddClose();
        } catch (error) {
            closeLoading();
            console.error('Error al agregar el producto:', error);
    
            Swal.fire({
                icon: 'error',
                title: 'Error al agregar el producto',
                text: 'Ocurrió un error al agregar el producto. Inténtalo de nuevo.'
            });
        }
    };
    
    
    const handleEditProduct = async () => {
        showLoading();
    
        try {
            await updateProduct(selectedProduct.id, newProduct);
            setProducts(products.map(product =>
                product.id === selectedProduct.id ? { ...product, ...newProduct } : product
            ));
    
            closeLoading();
    
            Swal.fire({
                icon: 'success',
                title: 'Producto actualizado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
    
            handleEditClose();
        } catch (error) {
            closeLoading();
            console.error('Error al actualizar el producto:', error);
    
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el producto',
                text: 'Ocurrió un error al actualizar el producto. Inténtalo de nuevo.'
            });
        }
    };
    

    const updateProduct = async (productId, productData) => {
        try {
            const response = await axios.put(
                `https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/update_product_put`,
                {
                    id: productId,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    discount: productData.discount,
                    stock: productData.stock,
                    category_id: productData.category_id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Producto actualizado con éxito:', response.data);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            if (error.response) {
                console.error('Datos de error:', error.response.data);
                console.error('Estado del error:', error.response.status);
            }
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleInputNumber = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: Number(value) });
    };

    const handleInputText = (e) => {
        const { name, value } = e.target;
        const maxLength = name === 'name' ? 30 : name === 'description' ? 50 : 255; // Ajusta longitud máxima según el campo
        setNewProduct({ ...newProduct, [name]: value.slice(0, maxLength) });
    };


    const toggleProductActive = async (productId) => {
        showLoading();
    
        try {
            const response = await axios.patch(
                `https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/toggle_product_active/${productId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            closeLoading();
    
            Swal.fire({
                icon: 'success',
                title: 'Estado del producto actualizado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
    
            setProducts(products.map(product =>
                product.id === productId ? { ...product, active: !product.active } : product
            ));
    
        } catch (error) {
            closeLoading();
            console.error('Error al cambiar el estado del producto:', error);
            if (error.response) {
                console.error('Datos de error:', error.response.data);
                console.error('Estado del error:', error.response.status);
            }
    
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar el estado del producto',
                text: 'Ocurrió un error al cambiar el estado del producto. Inténtalo de nuevo.'
            });
    
            throw error;
        }
    };
    

    const sortProducts = (criteria) => {
        let sortedProducts;
        switch (criteria) {
            case 'name-asc':
                sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                sortedProducts = [...products].sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts = [...products].sort((a, b) => b.price - a.price);
                break;
            default:
                sortedProducts = products;
        }
        setProducts(sortedProducts);
    };

    const insertProduct = async (productData) => {
        try {
            const response = await axios.post(
                'https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/insert_product',
                productData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Producto insertado con éxito:', response.data);
        } catch (error) {
            console.error('Error al insertar el producto:', error);
            if (error.response) {
                console.error('Datos de error:', error.response.data);
                console.error('Estado del error:', error.response.status);
            }
            throw error;
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.onloadend = () => {
                setNewProduct({
                    ...newProduct,
                    image_data: reader.result.split(',')[1], // Base64 sin la parte "data:image/jpeg;base64,"
                    image_type: file.type.split('/')[1] // 'jpeg' o 'png'
                });


            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {/* Carrusel */}
            <div className="carousel-container">
                <Carousel className="custom-carousel">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/1000x400"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    {/* Agrega más items del carrusel si es necesario */}
                </Carousel>
            </div>

            <Container>
                <Row className="mt-2 align-items-center fixed-filters">
                    <Col md={6}>
                        <h5>Nombre de la categoría</h5>

                    </Col>
                    <Col md={6} className="text-end">
                        <Button style={{ marginRight: '8px', backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}>
                            Filtros <HiAdjustmentsHorizontal />
                        </Button>
                        <Button style={{ marginRight: '8px', backgroundColor: 'transparent', color: 'black', border: '1px solid black' }} onClick={handleAddShow}>
                            Agregar Producto
                        </Button>
                        <Dropdown as="div" style={{ display: 'inline-block' }}>
                            <Dropdown.Toggle style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}>
                                Ordenar <HiChevronDown />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => sortProducts('name-asc')}>Nombre: A-Z</Dropdown.Item>
                                <Dropdown.Item onClick={() => sortProducts('name-desc')}>Nombre: Z-A</Dropdown.Item>
                                <Dropdown.Item onClick={() => sortProducts('price-asc')}>Precio: Menor a Mayor</Dropdown.Item>
                                <Dropdown.Item onClick={() => sortProducts('price-desc')}>Precio: Mayor a Menor</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                <Row className="mt-4">
                    {products.map((product, index) => (
                        <Col key={index} md={3} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={product.image} />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text><strong>Precio:</strong> ${product.price}</Card.Text>
                                    <Card.Text><strong>Categoría:</strong> {product.category}</Card.Text>
                                    <div className="d-flex justify-content-between mt-2">
                                        <Button variant="primary" size="sm" onClick={() => handleEditShow(product)}>Editar</Button>
                                        <Button
                                            variant={product.active ? "danger" : "success"}
                                            size="sm"
                                            onClick={() => toggleProductActive(product.id)}>
                                            {product.active ? "Desactivar" : "Activar"}
                                        </Button>
                                        <Button variant="warning" size="sm" onClick={() => handleEditImageShow(product)}>Editar Imagen</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Modal para agregar producto */}
            <Modal show={showAddModal} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Nombre del Producto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del Producto"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputText}
                                maxLength={30}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descripción"
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputText}
                                maxLength={50}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Precio"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDiscount">
                            <Form.Label>Descuento</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Descuento"
                                name="discount"
                                value={newProduct.discount}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductImage">
                            <Form.Label>Imagen del Producto</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductCategory">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Categoría"
                                name="category_id"
                                value={newProduct.category_id}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        Agregar Producto
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar producto */}
            <Modal show={showEditModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Nombre del Producto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del Producto"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputText}
                                maxLength={30}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descripción"
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputText}
                                maxLength={50}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Precio"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDiscount">
                            <Form.Label>Descuento</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Descuento"
                                name="discount"
                                value={newProduct.discount}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputNumber}
                            />
                        </Form.Group>

                        <Form.Group controlId="formProductCategory">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Categoría"
                                name="category_id"
                                value={newProduct.category_id}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleEditProduct}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditImageModal} onHide={handleEditImageClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Imagen del Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductImageEdit">
                            <Form.Label>Subir Nueva Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditImageClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleUploadImage}>
                        Guardar Imagen
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}
