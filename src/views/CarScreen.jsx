//Julio
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import CardsCarScreen from '../components/car/CardsCarScreen';
import CardTotalProductCarScreen from '../components/car/CardTotalProductCarScreen';

function CarScreen() {
  return (
    <Container>
      <Row>
        <Col md={8} className='mt-2 mb-5 '>
          <CardsCarScreen />
        </Col>
        <Col md={4} className='mt-2 mb-5'>
          <CardTotalProductCarScreen/>
        </Col>
      </Row>
    </Container>
  )
}

export default CarScreen
