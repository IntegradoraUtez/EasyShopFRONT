//Julio
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Logo from '../../src/assets/easyshop.png'


function Footer() {
  return (
    <footer className="bg-light text-dark py-3 footerStyle">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6}>
                        <Link className="navbar-brand" to="/">
                            <img src="" alt="EasyShop" className="imagenLogoFooter" />
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className="text-md-end">
                        <ul className="nav justify-content-center justify-content-md-end">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/category">Category</Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <p>&copy; {new Date().getFullYear()} EasyShop. Todos los derechos reservados.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
  )
}

export default Footer
