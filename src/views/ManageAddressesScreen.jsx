import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import CardsManageAddresses from '../components/manageAddresses/CardsManageAddresses';

function ManageAddressesScreen() {
  return (
    <Container>
      <Row>
        <Col className='mt-2 mb-5'>
          <CardsManageAddresses/>
        </Col>
      </Row>
    </Container>
  )
}

export default ManageAddressesScreen
