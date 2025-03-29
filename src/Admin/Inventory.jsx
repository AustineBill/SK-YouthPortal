import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import '../WebStyles/Admin-CSS.css';
// import './styles/Inventory.css';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    specification: "",
    status: "Available",
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios
      .get("https://isked-backend-ssmj.onrender.com/inventory")
      .then((response) => {
        setInventory(response.data);
        setFilteredInventory(response.data); // Initialize filtered inventory
      })
      .catch((error) => console.error(error));
  };

  // New: Search filter function for item names
  const applySearchFilter = useCallback((data) => {
    if (!searchTerm) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(item => {
      const itemName = item.name?.toLowerCase() || '';
      return itemName.includes(lowerSearchTerm);
    });
  }, [searchTerm]);

  useEffect(() => {
    setFilteredInventory(applySearchFilter(inventory));
  }, [inventory, searchTerm, applySearchFilter]);

  // New: Highlight matching text in item names
  const highlightSearchMatch = (text) => {
    if (!searchTerm || !text) return text;
    const lowerText = text.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearchTerm);
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {text.substring(index, index + searchTerm.length)}
        </span>
        {text.substring(index + searchTerm.length)}
      </>
    );
  };

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewItem({
        ...newItem,
        image: e.target.files[0],
      });
    }
  };

  const handleShowModal = (item = null) => {
    setCurrentItem(item);
    if (item) {
      setNewItem({
        name: item.name,
        quantity: item.quantity,
        specification: item.specification,
        status: item.status,
        image: null,
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
        await axios.put(
          `https://isked-backend-ssmj.onrender.com/inventory/${currentItem.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(
          "https://isked-backend-ssmj.onrender.com/inventory",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      fetchInventory();
      handleHideModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/inventory/${id}`
      );
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

      <div className="admin-inventory-search-add-container d-flex justify-content-between align-items-center">
        {/* New Search Bar */}
        <div className="admin-inventory-search-container d-flex align-items-center">
          <input
            type="text"
            placeholder="Search item by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-inventory-search-input rounded"
          />
        </div>

        <div className="admin-inventory-add-equipment-container d-flex align-items-center m-0">
          <button
            className="admin-inventory-add-equipment-button rounded"
            onClick={() => handleShowModal()}
          >
            Add Equipment
          </button>
        </div>
      </div>

      <div className="admin-inventory-contents-container">
        <table className="admin-inventory-table-container table-bordered">
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
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No items found</td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>{highlightSearchMatch(item.name)}</td>
                  <td>{item.quantity}</td>
                  <td>{item.specification}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="equipment-image"
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
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        className="admin-inventory-delete-button rounded-pill"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="admin-inventory-item-add-edit-modal modal"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-centered" role="document">
            <div className="modal-content">
              <div className="admin-inventory-item-add-edit-modal-header modal-header">
                <h5 className="modal-title">
                  {currentItem ? "Edit" : "Add"} Item
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleHideModal}
                ></button>
              </div>

              <div className="admin-inventory-item-add-edit-modal modal-body">
                <form onSubmit={handleSubmit} className="m-0">
                  <div className="admin-inventory-group-form d-flex flex-column">
                    <label className="admin-inventory-form-label">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleChange}
                      required
                      className="admin-inventory-form"
                    />
                  </div>

                  <div className="admin-inventory-group-form d-flex flex-column">
                    <label className="admin-inventory-form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newItem.quantity}
                      onChange={handleChange}
                      required
                      className="admin-inventory-form"
                    />
                  </div>

                  <div className="admin-inventory-group-form d-flex flex-column">
                    <label className="admin-inventory-form-label">Specification</label>
                    <input
                      type="text"
                      name="specification"
                      value={newItem.specification}
                      onChange={handleChange}
                      required
                      className="admin-inventory-form"
                    />
                  </div>

                  <div className="admin-inventory-group-form d-flex flex-column">
                    <label className="admin-inventory-form-label">Status</label>
                    <select
                      name="status"
                      value={newItem.status}
                      onChange={handleChange}
                      required
                      className="admin-inventory-form"
                    >
                      <option>Available</option>
                      <option>Repair/Maintenance</option>
                    </select>
                  </div>

                  <div className="admin-inventory-group-form d-flex flex-column">
                    <label className="admin-inventory-form-label">Upload Image (Optional)</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="admin-inventory-form"
                    />
                  </div>

                  <div className="admin-inventory-save-add-button-container">
                    <button type="submit" className="admin-inventory-item-button text-white rounded bg-primary">
                      {currentItem ? "Save Changes" : "Add Item"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
