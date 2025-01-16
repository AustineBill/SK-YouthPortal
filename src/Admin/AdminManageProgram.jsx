import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Modal, Alert, Button } from "react-bootstrap";
import "../WebStyles/Admin-CSS.css";

const ManageProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [activeContent, setActiveContent] = useState("allPrograms");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    heading: "",
    program_type: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("success"); // 'success' or 'danger'

  // Fetch all programs
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        "https://isked-backend-ssmj.onrender.com/api/programs"
      );
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleViewProgram = (program) => {
    setSelectedProgram((prev) =>
      prev && prev.id === program.id ? null : program
    );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.set("program_name", selectedProgram.program_name);
      formData.set("description", selectedProgram.description);
      formData.set("heading", selectedProgram.heading);
      formData.set("program_type", selectedProgram.program_type);

      if (selectedProgram.image) {
        formData.set("image", selectedProgram.image);
      }

      await axios.put(
        `https://isked-backend-ssmj.onrender.com/programs/${selectedProgram.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setModalMessage("Program updated successfully!");
      setModalVariant("success");
      setShowModal(true);

      fetchPrograms();
      setShowEditModal(false);
    } catch (error) {
      setModalMessage("Failed to save changes. Please try again.");
      setModalVariant("danger");
      setShowModal(true);
      console.error(error);
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();

    try {
      console.log("appending formData");

      const formData = new FormData();
      formData.append("program_name", newProgram.name);
      formData.append("description", newProgram.description);
      formData.append("heading", newProgram.heading);
      formData.append("program_type", newProgram.program_type);

      if (newProgram.image) {
        formData.append("image", newProgram.image);
      }

      console.log("FormData contents:", formData); // Add this line
      console.log("calling programs api");

      const response = await axios.post(
        "https://isked-backend-ssmj.onrender.com/programs",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("api call success");

      setPrograms((prev) => [...prev, response.data]);
      setNewProgram({
        name: "",
        description: "",
        heading: "",
        program_type: "",
        image: null,
      });
      setImagePreview(null);
      setActiveContent("allPrograms");

      setModalMessage("Program added successfully!");
      setModalVariant("success");
      setShowModal(true);
    } catch (error) {
      setModalMessage("There was an error adding the program.");
      setModalVariant("danger");
      setShowModal(true);
      console.error(error);
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram({
      id: program.id,
      program_name: program.program_name || program.name,
      description: program.description,
      heading: program.heading,
      program_type: program.program_type,
      image_url: program.image_url,
    });
    setShowEditModal(true);
    setImagePreview(program.image_url);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/programs/${programId}`
      );
      setPrograms(programs.filter((program) => program.id !== programId));

      setModalMessage("Program deleted successfully!");
      setModalVariant("success");
      setShowModal(true);
    } catch (error) {
      setModalMessage("Error deleting the program. Please try again.");
      setModalVariant("danger");
      setShowModal(true);
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedProgram((prev) => ({ ...prev, image: file }));
      setNewProgram((prev) => ({ ...prev, image: file }));

      if (selectedProgram) {
        setSelectedProgram((prev) => ({ ...prev, image: file }));
      } else {
        setNewProgram((prev) => ({ ...prev, image: file }));
      }
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className="admin-program-container d-flex flex-column">
      <div className="admin-program-label">
        <h2 className="admin-program-label-h2 fst-italic">Manage Programs</h2>
      </div>

      {/* Navigation tabs */}
      <ul className="admin-program-nav-tabs list-unstyled d-flex">
        <li
          className={activeContent === "allPrograms" ? "active-tab" : ""}
          onClick={() => setActiveContent("allPrograms")}
        >
          All Programs
        </li>
        <li
          className={activeContent === "addProgram" ? "active-tab" : ""}
          onClick={() => setActiveContent("addProgram")}
        >
          Add Program
        </li>
      </ul>

      <div className="admin-program-contents-container d-flex justify-content-center">
        {/* All Programs Section */}
        {activeContent === "allPrograms" && (
          <div className="admin-programs-details-container d-flex flex-column">
            {programs.length === 0 ? (
              <p>No programs available</p>
            ) : (
              programs.map((program) => (
                <Card key={program.id} className="admin-program-card d-flex">
                  <div className="admin-program-card-details d-flex">
                    <div className="admin-program-image-container d-flex justify-content-center align-items-center">
                      <Card.Img
                        variant="top"
                        src={
                          program.image_url || "https://via.placeholder.com/100"
                        }
                        alt={program.program_name}
                        className="admin-program-image"
                      />
                    </div>

                    <div className="admin-program-expandedn-details-container">
                      <Card.Body>
                        <p className="admin-program-title fw-bold">
                          {program.program_name}
                        </p>
                        <p className="admin-program-text">{program.heading}</p>
                        <div className="admin-program-details-buttons-container d-flex justify-content-center">
                          <button
                            onClick={() => handleViewProgram(program)}
                            className="program-view-button rounded-pill bg-info text-white"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="program-edit-button rounded-pill bg-warning text-white"
                          >
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(program.id)}
                            className="program-delete-button rounded-pill bg-danger text-white"
                          >
                            Delete Program
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {program === selectedProgram && (
                          <div className="admin-program-expanded-details-container d-flex flex-column text-center">
                            <h3 className="admin-program-description-label">
                              Description
                            </h3>
                            <p className="program-p">{program.description}</p>
                            <h5 className="admin-program-pt-label">
                              Program Type
                            </h5>
                            <p className="program-p">{program.program_type}</p>
                          </div>
                        )}
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Add Program Section */}
        {activeContent === "addProgram" && (
          <div className="admin-add-program-details-container d-flex justify-content-center">
            <form className="admin-add-program-details-group d-flex flex-column">
              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">Program Name</label>
                <input
                  type="text"
                  placeholder="Program Name"
                  name="name"
                  value={newProgram.name}
                  onChange={(e) =>
                    setNewProgram((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="add-program-form-control"
                />
              </div>

              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">
                  Program Description
                </label>
                <textarea
                  placeholder="Program Description"
                  name="description"
                  value={newProgram.description}
                  onChange={(e) =>
                    setNewProgram((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="add-program-form-control"
                />
              </div>

              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">Heading</label>
                <input
                  type="text"
                  placeholder="Heading"
                  name="heading"
                  value={newProgram.heading}
                  onChange={(e) =>
                    setNewProgram((prev) => ({
                      ...prev,
                      heading: e.target.value,
                    }))
                  }
                  className="add-program-form-control"
                />
              </div>

              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">Program Type</label>
                <input
                  type="text"
                  placeholder="Program Type"
                  name="program_type"
                  value={newProgram.program_type}
                  onChange={(e) =>
                    setNewProgram((prev) => ({
                      ...prev,
                      program_type: e.target.value,
                    }))
                  }
                  className="add-program-form-control"
                />
              </div>

              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">Program Image</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="add-program-form-control"
                />
                {imagePreview && <img src={imagePreview} alt="Preview" />}
              </div>

              <button
                onClick={handleAddProgram}
                className="admin-add-program-button rounded text-white"
              >
                Add Program
              </button>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProgram && (
          <div className="edit-program-modal d-flex flex-column rounded">
            <div className="edit-program-content">
              <h3 className="text-center">Edit Program</h3>
              <form className="admin-edit-program-details-group d-flex flex-column align-items-center">
                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">
                    Program Name
                  </label>
                  <input
                    type="text"
                    name="program_name"
                    value={selectedProgram.program_name}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">
                    Program Description
                  </label>
                  <textarea
                    name="description"
                    value={selectedProgram.description}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">
                    Program Type
                  </label>
                  <input
                    type="text"
                    name="program_type"
                    value={selectedProgram.program_type}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">
                    Program Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="edit-modal-buttons-container d-flex">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="edit-cancel-button bg-danger text-white rounded-pill"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="edit-save-button bg-success text-white rounded-pill"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalVariant === "success" ? "Success" : "Error"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant={modalVariant}>{modalMessage}</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageProgram;
