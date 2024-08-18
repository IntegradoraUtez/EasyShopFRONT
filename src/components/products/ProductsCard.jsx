import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Dropdown, Modal } from 'react-bootstrap';
import { HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";
import './ProductsCard.css'; // Asegúrate de tener un archivo CSS para los estilos adicionales
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductsCard() {
    const navigate = useNavigate();

    const handleProcessCarBuy = () => {
        navigate('/car')
    }
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (product) => {
        setSelectedProduct(product);
        setShow(true);
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


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://hr0jacwzd1.execute-api.us-east-1.amazonaws.com/Prod/get_products');
                console.log(response.data);
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    console.error("Formato de datos inesperado:", response.data);
                }
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
       
        const fetchCategories = async() => {
                    try {
                const response = await axios.get('');
                console.log(response.data);
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    console.error("Formato de datos inesperado:", response.data);
                }
            } catch (error) {
                
            }
        }
    
        fetchProducts();
    }, []);

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
                                <Card.Img variant="top" src={product.image} />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text><strong>Precio:</strong> ${product.price}</Card.Text>
                                    <Card.Text><strong>Categoría:</strong> {product.category}</Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="primary" onClick={handleProcessCarBuy}>Agregar al carrito</Button>
                                    </div>
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
                    <Button variant="primary" onClick={handleProcessCarBuy}>
                        Agregar al carrito de compra
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
