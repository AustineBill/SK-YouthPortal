import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {Container, Col, Row, Button} from 'react-bootstrap'

function Equipment() {
  const [quantities, setQuantities]= useState([0,0, 0]);
  const navigate = useNavigate();

  const increaseQuantity=(index) => {
    setQuantities((prevQuantites) => 
      prevQuantites.map((qty, i) => (i === index? qty + 1 : qty))
    );
  };

  const decreaseQuantity=(index) => {
    setQuantities((prevQuantites) => 
      prevQuantites.map((qty, i) => (i === index && qty > 0 ? qty -1 : qty))
    );
  };

  const equipmentData = [
    { id: 1, name: 'Pro Display XDR', price: 5999 },
    { id: 2, name: 'Pro Stand', price: 999 },
    { id: 3, name: 'Vesa Mount Adapter', price: 199 },
  ];


  return (
    <Container fluid className="my-5">
      <h1 className="text-center text-dark display-3">EQUIPMENTS</h1>
      <Row className="justify-content-center">
        {equipmentData.map((item, index) => (
          <Col md={3} className="mb-4" key={item.id}>
            <div className="card text-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/3.webp"
                className="card-img-top"
                alt={item.name}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="text-muted mb-4">Available: {item.price}</p>
                
                {/* Quantity controls */}
                <div className="d-flex justify-content-center align-items-center">
                  <Button variant="outline-secondary" size="sm" onClick={() => decreaseQuantity(index)}>-</Button>
                  <span className="mx-3">{quantities[index]}</span>
                  <Button variant="outline-secondary" size="sm" onClick={() => increaseQuantity(index)}>+</Button>
                </div>

                {/* Display total price based on quantity */}
                <div className="d-flex justify-content-between mt-4 font-weight-bold">
                  <span>Total</span>
                  <span>${(item.price * quantities[index]).toFixed(2)}</span>
                </div>

                 <Button className="btn-sm mt-5" variant="dark" onClick={() => navigate('/Equipment')}>Book Now</Button>



              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}


export default Equipment