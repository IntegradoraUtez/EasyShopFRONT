import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import AdminCategories from '../components/admin/AdminCategories'

export default function AdminCategoryScreen() {
  return (
    <Container>
      <Row>
        <Col className='mt-3'>
        <AdminCategories/>
        </Col>
      </Row>
    </Container>
  )
}
