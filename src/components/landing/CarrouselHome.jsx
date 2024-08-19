import React from 'react';
import { Carousel } from 'react-bootstrap';
import './styleHomeScreen.css';

function CarrouselHome() {
    const images = [
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/2_5.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/1_3.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/4_13.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/5_7.jpeg",
        "https://integradoraeasyshop.s3.us-east-1.amazonaws.com/categoriesImages/5_14.jpeg"
    ];

    return (
        <Carousel className="custom-carousel">
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={image}
                        alt={`Slide ${index + 1}`}
                    />
                    <Carousel.Caption>
                        <h3>{`Categoría ${index + 1}`}</h3>
                        <p>{`Esta es la imagen ${index + 1} de la categoría.`}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CarrouselHome;
