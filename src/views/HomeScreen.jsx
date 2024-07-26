//Julio

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CarrouselHome from '../components/landing/CarrouselHome';
import CardsCategoryHome from '../components/landing/CardsCategoryHome';

const HomeScreen = () => {
  return (
    <Container>
      <Row>
        <Col className='mt-5'>
          <CarrouselHome />
        </Col>
      </Row>
      <Row>
        <Col className='mt-3'>
          <CardsCategoryHome/>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;