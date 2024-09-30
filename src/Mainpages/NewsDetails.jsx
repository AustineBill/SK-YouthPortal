import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the image
import Hans from '../Assets/HANS MARTINEZ.png';


const contentData = [
    {
      id: 1,
      title: 'Transparency and Accountability',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: Hans,
      details: 'Detailed description for Transparency and Accountability...',
    },
    {
      id: 2,
      title: 'Financial Information',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: 'https://via.placeholder.com/150',
      details: 'Detailed description for Financial Information...',
    },
    {
      id: 3,
      title: 'Public Records',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: 'https://via.placeholder.com/150',
      details: 'Detailed description for Public Records...',
    },
];

const ViewDetailed = () => {

    const { id } = useParams(); // Get the ID from the URL
    const item = contentData.find((item) => item.id === parseInt(id)); // Find the item by ID

    if (!item) return <p>Item not found</p>;


    return (
        <div className="container-fluid">
            <div className="text-center text-lg-start">
                <h1 className="Maintext animated slideInRight">{item.title}</h1>
                    <p className="Subtext">Published Data</p>
            </div>

            <Container className="mt-4">
                <Row className="align-items-center mb-4">
                    <Col md={4}>
                        <Image src={item.imageUrl} alt={item.title} fluid />
                    </Col>
                    <Col md={8}>
                        <h4>{item.description}</h4>
                            <p>{item.year}</p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>{item.details}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ViewDetailed;