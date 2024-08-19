import React from 'react';
import { Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import { BsXCircle } from "react-icons/bs";
import { getCartItems, saveCartItems } from '../../context/CartUtils';

function CardsCarScreen() {
    const [cartItems, setCartItems] = React.useState([]);
    const [userId, setUserId] = React.useState(null);

    React.useEffect(() => {
        // Recuperar el ID del usuario desde localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserId(storedUser.id); // Asumiendo que userData tiene una propiedad id
        }

        // Recuperar los artículos del carrito desde localStorage
        const allCartItems = getCartItems();
        // Filtrar los artículos del carrito por el ID del usuario
        if (userId !== null) {
            const userCartItems = allCartItems.filter(item => item.userId === userId);
            setCartItems(userCartItems);
        }
    }, [userId]);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        saveCartItems(updatedCart); // Guarda los cambios en el Local Storage
    };

    return (
        <Accordion defaultActiveKey="0" className='mt-3 centered-container'>
            {cartItems.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={item.id}>
                    <Accordion.Header>{item.name}</Accordion.Header>
                    <Accordion.Body>
                        <Card className="my-3">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={12} md={1} className="text-center my-2">
                                        <Button variant="link" onClick={() => handleRemoveFromCart(item.id)}>
                                            <BsXCircle size={25} />
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={3} className="text-center my-2">
                                        <Card.Img src={item.image} style={{ maxWidth: '150px', maxHeight: '200px' }} />
                                    </Col>
                                    <Col xs={12} md={6} className="my-2">
                                        <p><strong>Nombre:</strong> {item.name}</p>
                                        <p><strong>Precio:</strong> ${item.price}</p>
                                        <p><strong>Stock:</strong> {item.stock}</p>
                                        <p><strong>Descuento:</strong> ${item.discount}</p>
                                        <p><strong>Categoría:</strong> {item.category}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default CardsCarScreen;
