import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Dropdown, Modal } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCartItems, saveCartItems } from '../../context/CartUtils';
import { useAuth } from '../../context/AuthContext';
import './ProductsCard.css';

export default function ProductsCard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (product) => {
        setSelectedProduct(product);
        setShow(true);
    };

    const handleAddToCart = (product) => {
        const newCartItems = [...cartItems, product];
        setCartItems(newCartItems);
        saveCartItems(newCartItems);

        Swal.fire({
            title: '¡Producto agregado!',
            text: `${product.name} ha sido agregado al carrito.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
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
    const images = [
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/2_5.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/1_3.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/4_13.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/5_7.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/5_14.jpeg"
    ];
    useEffect(() => {
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
    }, []);

    useEffect(() => {
        setCartItems(getCartItems());
    }, []);

    return (
        <>
            <div className="carousel-container">
            <Carousel className="custom-carousel">
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={image}
                        alt={`Slide ${index + 1}`}
                    />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
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
                            <Card onClick={() => handleShow(product)}>
                                <Card.Img variant="top" src={product.image} className="product" />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text><strong>Precio:</strong> ${product.price}</Card.Text>
                                    <Card.Text><strong>Categoría:</strong> {product.category}</Card.Text>
                                    {user.user.type === 'user' && (
                                        <div className="d-flex justify-content-center">
                                            <Button variant="primary" onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}>
                                                Agregar al carrito
                                            </Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedProduct?.image} alt={selectedProduct?.name} className="img-fluid" />
                    <p><strong>Descripción:</strong> {selectedProduct?.description}</p>
                    <p><strong>Precio:</strong> ${selectedProduct?.price}</p>
                    <p><strong>Descuento:</strong> {selectedProduct?.discount * 100}%</p>
                    <p><strong>Stock:</strong> {selectedProduct?.stock}</p>
                    <p><strong>Categoría:</strong> {selectedProduct?.category}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    {user.user.type === 'user' && (
                        <Button variant="primary" onClick={() => {
                            handleAddToCart(selectedProduct);
                            handleClose();
                        }}>
                            Agregar al carrito de compra
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}
