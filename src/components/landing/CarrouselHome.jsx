import React from 'react';
import { Carousel } from 'react-bootstrap';
import './styleHomeScreen.css';

function CarrouselHome({ images }) {
    return (
        <>
            <Carousel className="custom-carousel">
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={image.url}
                                alt={`Slide ${index + 1}`}
                            />
                            <Carousel.Caption>
                                <h3>{`Slide ${index + 1}`}</h3>
                                <p>{image.description || 'Descripción de la imagen'}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400"
                            alt="Placeholder slide"
                        />
                        <Carousel.Caption>
                            <h3>No hay imágenes disponibles</h3>
                            <p>Por favor, intente más tarde.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )}
            </Carousel>
        </>
    );
}

export default CarrouselHome;
