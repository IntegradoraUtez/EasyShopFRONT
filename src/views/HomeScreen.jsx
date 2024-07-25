//Julio

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

const HomeScreen = () => {
  return (
    <Container>
      <h1>Home Screen</h1>
      <Row>
        <Col>
          <Link to="/admin/dashboard">
            <Button variant="primary" className="custom-button m-2">Admin Dashboard</Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="primary" className="m-2">Admin Products</Button>
          </Link>
          <Link to="/admin/purchases">
            <Button variant="primary" className="m-2">Admin Purchases</Button>
          </Link>
          <Link to="/card/insert">
            <Button variant="primary" className="m-2">Card Insert</Button>
          </Link>
          <Link to="/car">
            <Button variant="primary" className="m-2">Car</Button>
          </Link>
          <Link to="/pay">
            <Button variant="primary" className="m-2">Pay</Button>
          </Link>
          <Link to="/product">
            <Button variant="primary" className="m-2">Product</Button>
          </Link>
          <Link to="/profile">
            <Button variant="primary" className="m-2">Profile</Button>
          </Link>
          <Link to="/user/update">
            <Button variant="primary" className="m-2">Update User</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;