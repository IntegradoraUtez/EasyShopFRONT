//Julio
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import RegisterCardScreen from '../components/cardInsert/RegisterCardScreen';

function CardInsertScreen() {
  return (
    <Container>
      <Row>
        <Col className='mt-3'>
          <RegisterCardScreen/>
        </Col>
      </Row>
    </Container>
  )
}

export default CardInsertScreen
