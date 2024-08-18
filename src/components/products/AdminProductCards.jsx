import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Dropdown, Modal, Form } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import './ProductsCard.css'; // Asegúrate de tener un archivo CSS para los estilos adicionales
import { useAuth } from '../../context/AuthContext';


export default function ProductsCard() {

    const {user} = useAuth();

    useEffect(() => {
        if (user) {
            console.log('Usuario:', user.user);
            console.log('Tipo:', user.user.type);
            console.log('Token:', user.token);
        }
    }, [user]);
    const [products, setProducts] = useState([
        {
            name: "Producto 1",
            description: "Una descripción rápida del producto 1.",
            price: 19.99,
            discount: 0.1, // 10% de descuento
            stock: 15,
            image: "https://m.media-amazon.com/images/I/61k+1UDe73L.jpg",
            category: "Categoría 1"
        },
        {
            name: "Producto 2",
            description: "Otra descripción rápida del producto 2.",
            price: 29.99,
            discount: 0.2, // 20% de descuento
            stock: 8,
            image: "https://i.pinimg.com/736x/e4/b1/84/e4b1841cdda985a28432ab9d5492c12d.jpg",
            category: "Categoría 2"
        },
        {
            name: "Producto 3",
            description: "Descripción rápida del producto 3.",
            price: 9.99,
            discount: 0.05, // 5% de descuento
            stock: 20,
            image: "https://via.placeholder.com/150",
            category: "Categoría 3"
        },
        {
            name: "Producto 4",
            description: "Descripción rápida del producto 4.",
            price: 49.99,
            discount: 0.15, // 15% de descuento
            stock: 10,
            image: "https://via.placeholder.com/150",
            category: "Categoría 4"
        },
        {
            name: "Producto 5",
            description: "Descripción rápida del producto 5.",
            price: 14.99,
            discount: 0.1, // 10% de descuento
            stock: 25,
            image: "https://via.placeholder.com/150",
            category: "Categoría 5"
        },
        {
            name: "Producto 6",
            description: "Descripción rápida del producto 6.",
            price: 39.99,
            discount: 0.2, // 20% de descuento
            stock: 5,
            image: "https://via.placeholder.com/150",
            category: "Categoría 6"
        },
        {
            name: "Producto 7",
            description: "Descripción rápida del producto 7.",
            price: 24.99,
            discount: 0.1, // 10% de descuento
            stock: 12,
            image: "https://via.placeholder.com/150",
            category: "Categoría 7"
        },
        {
            name: "Producto 8",
            description: "Descripción rápida del producto 8.",
            price: 34.99,
            discount: 0.25, // 25% de descuento
            stock: 7,
            image: "https://via.placeholder.com/150",
            category: "Categoría 8"
        },
        {
            name: "Producto 9",
            description: "Descripción rápida del producto 9.",
            price: 44.99,
            discount: 0.3, // 30% de descuento
            stock: 3,
            image: "https://via.placeholder.com/150",
            category: "Categoría 9"
        },
        {
            name: "Producto 10",
            description: "Descripción rápida del producto 10.",
            price: 54.99,
            discount: 0.4, // 40% de descuento
            stock: 1,
            image: "https://via.placeholder.com/150",
            category: "Categoría 10"
        },
        // Agrega más productos aquí...
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        image: '',
        category: ''
    });

    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => {
        // Limpia el estado del nuevo producto
        setNewProduct({
            name: '',
            description: '',
            price: '',
            discount: '',
            stock: '',
            image: '',
            category: ''
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
            image: product.image,
            category: product.category
        });
        setShowEditModal(true);
    };

    const handleAddProduct = () => {
        setProducts([...products, { 
            ...newProduct, 
            price: parseFloat(newProduct.price), 
            discount: parseFloat(newProduct.discount), 
            stock: parseInt(newProduct.stock) 
        }]);
        handleAddClose();
    };

    const handleEditProduct = () => {
        setProducts(products.map(product => 
            product === selectedProduct 
                ? { 
                    ...newProduct, 
                    price: parseFloat(newProduct.price), 
                    discount: parseFloat(newProduct.discount), 
                    stock: parseInt(newProduct.stock) 
                }
                : product
        ));
        handleEditClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleInputNumber = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9.]/g, '').slice(0, 8); // Permitir solo números y hasta 8 dígitos
        setNewProduct({ ...newProduct, [name]: numericValue });
    };

    const handleInputText = (e) => {
        const { name, value } = e.target;
        const maxLength = name === 'name' ? 30 : name === 'description' ? 50 : 255; // Ajusta longitud máxima según el campo
        setNewProduct({ ...newProduct, [name]: value.slice(0, maxLength) });
    };

    const handleDeactivateProduct = (product) => {
        // Lógica para desactivar el producto
        console.log('Desactivar producto', product);
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

                <Row className="mt-5">
                    {products.map((product, index) => (
                        <Col key={index} md={3} className="mb-4">
                            <Card>
                                <Card.Img className="card-img" variant="top" src={product.image} />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text><strong>Precio:</strong> ${product.price}</Card.Text>
                                    <Card.Text><strong>Categoría:</strong> {product.category}</Card.Text>
                                    <div className="d-flex justify-content-between mt-2">
                                        <Button variant="secondary" size="sm" onClick={() => handleEditShow(product)}>Editar</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeactivateProduct(product)}>Desactivar</Button>
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
                                type="text" 
                                placeholder="Precio" 
                                name="price" 
                                value={newProduct.price} 
                                onChange={handleInputNumber} 
                                maxLength={8} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDiscount">
                            <Form.Label>Descuento</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Descuento" 
                                name="discount" 
                                value={newProduct.discount} 
                                onChange={handleInputNumber} 
                                maxLength={8} 
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
                            <Form.Label>URL de la Imagen</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="URL de la Imagen" 
                                name="image" 
                                value={newProduct.image} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductCategory">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Categoría" 
                                name="category" 
                                value={newProduct.category} 
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
                                type="text" 
                                placeholder="Precio" 
                                name="price" 
                                value={newProduct.price} 
                                onChange={handleInputNumber} 
                                maxLength={8} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDiscount">
                            <Form.Label>Descuento</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Descuento" 
                                name="discount" 
                                value={newProduct.discount} 
                                onChange={handleInputNumber} 
                                maxLength={8} 
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
                            <Form.Label>URL de la Imagen</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="URL de la Imagen" 
                                name="image" 
                                value={newProduct.image} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductCategory">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Categoría" 
                                name="category" 
                                value={newProduct.category} 
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
        </>
    );
}
