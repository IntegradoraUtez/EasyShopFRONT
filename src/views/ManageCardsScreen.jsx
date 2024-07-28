import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import CardsManageCards from '../components/manageCards/CardsManageCards';

function ManageCardsScreen() {
  return (
    <Container>
      <Row>
        <Col className='mt-2 mb-5'>
          <CardsManageCards/>
        </Col>
      </Row>
    </Container>
  )
}

export default ManageCardsScreen
