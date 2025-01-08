import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "./styles/Inventory.css";
// import './styles/Admin-CSS.css';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    specification: "",
    status: "Available",
    image: null,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:5000/inventory")
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setNewItem({
      ...newItem,
      image: e.target.files[0],
    });
  };

  const handleShowModal = (item = null) => {
    setCurrentItem(item);
    if (item) {
      setNewItem({
        name: item.name,
        quantity: item.quantity,
        specification: item.specification,
        status: item.status,
        image: null, // New image will be uploaded if edited
      });
    } else {
      setNewItem({
        name: "",
        quantity: "",
        specification: "",
        status: "Available",
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleHideModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("quantity", newItem.quantity);
    formData.append("specification", newItem.specification);
    formData.append("status", newItem.status);
    if (newItem.image) {
      formData.append("image", newItem.image);
    }

    try {
      if (currentItem) {
        // Edit
        await axios.put(
          `http://localhost:5000/inventory/${currentItem.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Add
        await axios.post("http://localhost:5000/inventory", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchInventory();
      handleHideModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting item with ID:", id);
    try {
      await axios.delete(`http://localhost:5000/inventory/${id}`);
      fetchInventory();
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  return (
    <div className="admin-inventory-container">
      <div className="admin-inventory-label">
        <h2 className="admin-inventory-label-h2 fst-italic">Inventory</h2>
      </div>

      <div className="admin-inventory-add-equipment-container">
        <button
          className="admin-inventory-add-equipment-button rounded"
          onClick={() => handleShowModal()}
        >
          Add Equipment
        </button>
      </div>

      {/* <Table striped bordered hover> */}
      <div className="admin-inventory-contents-container">
        <Table className="admin-inventory-table-container table-bordered">
          <thead className="admin-inventory-head text-center">
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Specification</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="admin-inventory-body text-center">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.specification}</td>
                <td>{item.status}</td>
                <td>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100px", height: "125px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <div className="admin-inventory-actions-buttons-container d-flex justify-content-center">
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal(item)}
                      className="admin-inventory-edit-button rounded-pill"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                      className="admin-inventory-delete-button rounded-pill"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={handleHideModal}
        centered
        className="admin-inventory-modal-container d-flex justify-content-center"
      >
        <Modal.Header closeButton>
          <Modal.Title className="admin-inventory-modal-title fst-italic">
            {currentItem ? "Edit Item" : "Add Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-inventory-modal-body">
          <Form onSubmit={handleSubmit} className="m-0 p-0">
            <Form.Group
              controlId="name"
              className="admin-inventory-form-group d-flex flex-column"
            >
              <Form.Label className="admin-inventory-form-label">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                required
                className="admin-inventory-form"
              />
            </Form.Group>

            <Form.Group
              controlId="quantity"
              className="admin-inventory-form-group d-flex flex-column"
            >
              <Form.Label className="admin-inventory-form-label">
                Quantity
              </Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleChange}
                required
                className="admin-inventory-form"
              />
            </Form.Group>

            <Form.Group
              controlId="specification"
              className="admin-inventory-form-group d-flex flex-column"
            >
              <Form.Label className="admin-inventory-form-label">
                Specification
              </Form.Label>
              <Form.Control
                type="text"
                name="specification"
                value={newItem.specification}
                onChange={handleChange}
                required
                className="admin-inventory-form"
              />
            </Form.Group>

            <Form.Group
              controlId="status"
              className="admin-inventory-form-group d-flex flex-column"
            >
              <Form.Label className="admin-inventory-form-label">
                Status
              </Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newItem.status}
                onChange={handleChange}
                required
                className="admin-inventory-form"
              >
                <option>Available</option>
                <option>Out of Stock</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="image"
              className="admin-inventory-form-group d-flex flex-column"
            >
              <Form.Label className="admin-inventory-form-label">
                Upload Image
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
                required
                className="admin-inventory-form"
              />
            </Form.Group>

            <div className="admin-inventory-save-add-button-container">
              <Button
                variant="primary"
                type="submit"
                className="admin-inventory-save-add-button rounded"
              >
                {currentItem ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InventoryTable;
