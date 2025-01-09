import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Button, Modal, Card } from "react-bootstrap";
import axios from "axios";

function Equipment() {
  const [inventory, setInventory] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/inventory");
        setInventory(response.data);
        setQuantities(Array(response.data.length).fill(0));
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  // Modal handlers
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Increase quantity handler
  const increaseQuantity = (index) => {
    if (quantities[index] < inventory[index].quantity) {
      setQuantities((prevQuantities) =>
        prevQuantities.map((qty, i) => (i === index ? qty + 1 : qty))
      );
    } else {
      handleShowModal(
        "You cannot reserve more than the available quantity of this equipment."
      );
    }
  };

  // Decrease quantity handler
  const decreaseQuantity = (index) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((qty, i) => (i === index && qty > 0 ? qty - 1 : qty))
    );
  };

  // Handle reservation submission
  const handleReserve = () => {
    const reserved = inventory
      .map((item, index) => ({
        id: item.id,
        name: item.name, // Equipment name
        quantity: quantities[index], // Quantity reserved by the user
      }))
      .filter((item) => item.quantity > 0); // Only include items with quantity > 0

    if (reserved.length === 0) {
      handleShowModal("Please reserve at least one piece of equipment.");
      return;
    }
    sessionStorage.setItem("reservedEquipment", JSON.stringify(reserved));
    navigate("/EquipReservation");
  };

  return (
    <Container fluid className="my-5">
      <h1 className="text-center text-dark display-3">EQUIPMENTS</h1>
      <Row className="justify-content-center">
        {inventory.length === 0 ? (
          <p>No program available</p>
        ) : (
          inventory.map((item, index) => (
            <Col md={3} className="mb-4" key={item.id}>
              <Card className="ProgramCard text-center">
                {item.image ? (
                  <Card.Img
                    variant="top"
                    src={item.image} // Adjust the URL to point to your server's upload folder
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src="/Asset/Equipment/Chairs.png" // Fallback image if no image available
                    alt="Default"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.specification}</Card.Text>
                  <Card.Text>
                    {item.status}: {item.quantity}
                  </Card.Text>
                  {/* Quantity controls */}
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => decreaseQuantity(index)}
                    >
                      -
                    </Button>
                    <span className="mx-3">{quantities[index]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => increaseQuantity(index)}
                    >
                      +
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Reserve Button */}
      <Row className="d-flex justify-content-center mt-4">
        <div className="text-center">
          <Button
            variant="dark"
            className="py-3 px-5 fw-bold"
            onClick={handleReserve}
            disabled={quantities.every((qty) => qty === 0)}
          >
            Reserve Equipment
          </Button>
        </div>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Equipment;
