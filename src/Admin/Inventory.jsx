import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    specification: '',
    status: 'Available',
    image: null,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/inventory')
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => console.error(error));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('quantity', newItem.quantity);
    formData.append('specification', newItem.specification);
    formData.append('status', newItem.status);
    formData.append('image', newItem.image);

    try {
      await axios.post('http://localhost:5000/inventory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewItem({
        name: '',
        quantity: '',
        specification: '',
        status: 'Available',
        image: null,
      });
      // Refresh the inventory list
      axios.get('http://localhost:5000/inventory')
        .then(response => setInventory(response.data))
        .catch(error => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Specification</th>
            <th>Status</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.specification}</td>
              <td>{item.status}</td>
              <td>
                {item.image ? (
                  <img
                    src={item.image} // Adjust the URL to point to your server's upload folder
                    alt={item.name}
                    style={{ width: '100px', height: 'auto' }}
                  />
                ) : (
                  <img
                    src="/Asset/Equipment/Chairs.png" // Fallback image if no image available
                    alt="Default"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Add New Item</h3>
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
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Item
        </Button>
      </Form>
    </div>
  );
};

export default InventoryTable;
