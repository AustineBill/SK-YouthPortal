  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Table, Button, Form, Modal } from 'react-bootstrap';

  const InventoryTable = () => {
    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newItem, setNewItem] = useState({
      name: '',
      quantity: '',
      specification: '',
      status: 'Available',
      image: null,
    });

    useEffect(() => {
      fetchInventory();
    }, []);

    const fetchInventory = () => {
      axios
        .get('http://localhost:5000/inventory')
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
          name: '',
          quantity: '',
          specification: '',
          status: 'Available',
          image: null,
        });
      }
      setShowModal(true);
    };

    const handleHideModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('quantity', newItem.quantity);
      formData.append('specification', newItem.specification);
      formData.append('status', newItem.status);
      if (newItem.image) {
        formData.append('image', newItem.image);
      }

      try {
        if (currentItem) {
          // Edit
          await axios.put(`http://localhost:5000/inventory/${currentItem.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // Add
          await axios.post('http://localhost:5000/inventory', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        fetchInventory();
        handleHideModal();
      } catch (error) {
        console.error(error);
      }
    };

    const handleDelete = async (id) => {
      console.log('Deleting item with ID:', id);
      try {
        await axios.delete(`http://localhost:5000/inventory/${id}`);
        fetchInventory();
      } catch (error) {
        console.error('Error in handleDelete:', error);
      }
    };
    

    return (
      <div>
        <h2>Inventory</h2>
        <div className="position-fixed bottom-0 end-0 mb-3 me-3">
          <button className="btn-db" onClick={() => handleShowModal()}> Add Equipment</button>
        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Specification</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
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
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleShowModal(item)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={handleHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{currentItem ? 'Edit Item' : 'Add Item'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="specification">
                <Form.Label>Specification</Form.Label>
                <Form.Control
                  type="text"
                  name="specification"
                  value={newItem.specification}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={newItem.status}
                  onChange={handleChange}
                >
                  <option>Available</option>
                  <option>Out of Stock</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                {currentItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  export default InventoryTable;
