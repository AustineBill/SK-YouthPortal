// NewsEvents.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Hans from "../assets/HANS MARTINEZ.png";

const NewsEvents = () => {
  const contentData = [
    {
      id: 1,
      title: 'Transparency and Accountability',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: Hans,
    },
    {
      id: 2,
      title: 'Financial Information',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Public Records',
      year: '2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start">
        <h1 className="Maintext animated slideInRight">News and Events</h1>
        <p className="Subtext">Get the inside scoop on all the action</p>
      </div>
      
      <div className="bg-secondary">
        <h2 className="NewEve-subheadline">Inside SK Youth Scoop</h2>

        <Container className="mt-4">
          {contentData.map((item) => (
            <Row key={item.id} className="mb-4 align-items-center">
              <Col md={4}>
                <Image src={item.imageUrl} alt={item.title} fluid />
              </Col>
              <Col md={8}>
                <h5>{item.title}</h5>
                <p>{item.year}</p>
                <p>{item.description}</p>
                <Link to={`/news-details/${item.id}`} className="text-muted">View Details...</Link>
              </Col>
            </Row>
          ))}
        </Container>
      </div>
    </div>
  );
}

export default NewsEvents;
