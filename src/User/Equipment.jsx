import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  Container,
  Col,
  Row,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import axios from "axios";

function Equipment() {
  const location = useLocation();
  const { state } = location;
  const programType =
    state?.programType || sessionStorage.getItem("programType"); // Retrieve from sessionStorage if missing
  const [inventory, setInventory] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Redirect if programType is missing
  useEffect(() => {
    if (!programType) {
      navigate("/UserProgram"); // Redirect to a safe page
    }
  }, [programType, navigate]);

  // Fetch inventory data
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
        name: item.name,
        quantity: quantities[index],
      }))
      .filter((item) => item.quantity > 0);

    if (reserved.length === 0) {
      handleShowModal("Please reserve at least one piece of equipment.");
      return;
    }

    sessionStorage.setItem("reservedEquipment", JSON.stringify(reserved));
    navigate("/EquipReservation");
  };

  return (
    <Container fluid className="my-5">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/UserProgram")}>
          Programs
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() =>
            navigate("/ProgramDetails", { state: { programType } })
          }
        >
          Program Details
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Equipments</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">EQUIPMENTS</h1>
        <p className="Subtext">Choose Your Equipment/s</p>
      </div>
      <Row className="justify-content-center g-4">
        {inventory.length === 0 ? (
          <p>No equipment available</p>
        ) : (
          inventory.map((item, index) => (
            <Col
              key={item.id}
              xs={12}
              sm={6}
              md={6}
              lg={3}
              className="d-flex justify-content-center"
            >
              <Card className="ProgramCard text-center">
                {item.image ? (
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src="/Asset/Equipment/Chairs.png"
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
                    Status:{" "}
                    <span
                      className={
                        item.status === "Out of Stock"
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {item.status}
                    </span>
                  </Card.Text>
                  <Card.Text>Available Quantity: {item.quantity}</Card.Text>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => decreaseQuantity(index)}
                      disabled={item.status === "Out of Stock"}
                    >
                      -
                    </Button>
                    <span className="mx-3">{quantities[index]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => increaseQuantity(index)}
                      disabled={item.status === "Out of Stock"}
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

      <Row className="d-flex justify-content-center mt-4">
        <div className="text-center">
          <Button
            className="py-3 px-5 fw-bold clr-db"
            onClick={handleReserve}
            disabled={quantities.every((qty) => qty === 0)}
          >
            Reserve Equipment
          </Button>
        </div>
      </Row>

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
