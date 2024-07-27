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
                    <Col className='text-center'>
                        <Link className="navbar-brand" to="/">
                            <img src={Logo} style={{height:170, width:250}} alt="EasyShop"/>
                        </Link>
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
