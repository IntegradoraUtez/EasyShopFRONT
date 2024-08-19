import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import ViewPurchases from '../components/viewPurchasesUserId/ViewPurchases';

function ViewPurchasesUserIdScreen() {
  return (
    <Container>
      <Row>
        <Col className='mt-2 mb-5'>
            <ViewPurchases/>
        </Col>
      </Row>
    </Container>
  )
}

export default ViewPurchasesUserIdScreen
