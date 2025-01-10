import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import "./styles/AdminManageProgram.css";

const ManageProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [activeContent, setActiveContent] = useState("allPrograms");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    heading: "",
    amenities: [],
    program_type: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [amenityImages, setAmenityImages] = useState([]);

  // Fetch all programs from backend using axios
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/programs");
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("program_name", selectedProgram.program_name);
    formData.append("description", selectedProgram.description);
    formData.append("heading", selectedProgram.heading);
    formData.append("program_type", selectedProgram.program_type);

    // Handle main image upload (only if changed)
    if (selectedProgram.image) {
      formData.append("image", selectedProgram.image);
    }

    // Handle amenity images (only if added/changed)
    if (amenityImages.length > 0) {
      amenityImages.forEach((image) => formData.append("amenities", image));
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/programs/${selectedProgram.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedProgram = response.data;

      // Update the program list with the edited program
      setPrograms((prev) =>
        prev.map((program) =>
          program.id === updatedProgram.id ? updatedProgram : program
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleAddProgram = async () => {
    const formData = new FormData();
    formData.append("program_name", newProgram.name);
    formData.append("description", newProgram.description);
    formData.append("heading", newProgram.heading);
    formData.append("program_type", newProgram.program_type);

    // Handle image upload for program image
    if (newProgram.image) {
      formData.append("image", newProgram.image);
    }

    // Handle amenity images
    if (amenityImages.length > 0) {
      amenityImages.forEach((image) => formData.append("amenities", image));
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/programs",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Assuming the backend returns the program with the image URL
      setPrograms((prev) => [...prev, response.data]); // Add newly added program to list

      // Reset form state
      setNewProgram({
        name: "",
        description: "",
        heading: "",
        program_type: "",
        image: null,
      });
      setImagePreview(null);
      setAmenityImages([]);
      setActiveContent("allPrograms");
    } catch (error) {
      console.error("Error adding program:", error);
      alert("There was an error adding the program.");
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowEditModal(true);
    setImagePreview(program.image_url);
    setAmenityImages(program.amenities || []);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await axios.delete(`http://localhost:5000/programs/${programId}`);
      setPrograms(programs.filter((program) => program.id !== programId));
      setSelectedProgram(null);
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProgram((prev) => ({ ...prev, image: file }));
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleAmenityImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setAmenityImages((prevImages) => [...prevImages, ...files]);
  };

  const handleExpandCard = (program) => {
    setSelectedProgram(program === selectedProgram ? null : program);
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
                        src={program.image_url || "https://via.placeholder.com/100"}
                        alt={program.program_name}
                        className="admin-program-image"
                      />
                    </div>

                    <div className="admin-program-details-container d-flex align-items-center text-center">
                      <Card.Body>
                        <Card.Title>{program.program_name}</Card.Title>
                        <Card.Text className="admin-program-text">{program.heading}</Card.Text>
                        <div className="admin-program-details-buttons-container d-flex justify-content-center">
                          <Button
                            variant="info"
                            onClick={() => handleExpandCard(program)}
                            className="program-details-button"
                          >
                            {program === selectedProgram
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                          <Button
                            variant="warning"
                            onClick={() => handleEditProgram(program)}
                            className="program-edit-button"
                          >
                            Edit Details
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteProgram(program.id)}
                            className="program-delete-button"
                          >
                            Delete Program
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {program === selectedProgram && (
                          <div className="admin-program-expanded-details-container d-flex flex-column text-center">
                            <h3 className="admin-program-description-label">Description</h3>
                            <p className="program-p">{program.description}</p>
                            <h4 className="admin-program-amenities-label">Amenities</h4>
                            {program.amenities && program.amenities.length > 0 ? (
                              <div className="amenities-image-container d-flex justify-content-center">
                                {program.amenities.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Amenity ${index}`}
                                    className="amenity-preview"
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="program-p">No amenities available.</p>
                            )}
                            <h5 className="admin-program-pt-label">Program Type</h5>
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
        )
        }

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

              <div className="admin-add-program-form d-flex flex-column">
                <label className="admin-add-program-label">
                  Amenity Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleAmenityImageUpload}
                  className="add-program-form-control"
                />
              </div>

              <button onClick={handleAddProgram}
                className='admin-add-program-button rounded text-white'>
                Add Program
              </button>
            </form>
          </div>
        )
        }

        {/* Edit Modal */}
        {showEditModal && selectedProgram && (
          <div className="edit-program-modal d-flex flex-column">
            <div className="edit-program-content">
              <h3 className="text-center">Edit Program</h3>
              <form className="admin-edit-program-details-group d-flex flex-column align-items-center">
                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">Program Name</label>
                  <input
                    type="text"
                    name="program_name"
                    value={selectedProgram.program_name}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">Program Description</label>
                  <textarea
                    name="description"
                    value={selectedProgram.description}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">Program Type</label>
                  <input
                    type="text"
                    name="program_type"
                    value={selectedProgram.program_type}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">Program Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="admin-edit-program-form d-flex flex-column">
                  <label className="admin-edit-program-label">Program Ameneties</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAmenityImageUpload}
                    multiple
                  />
                </div>
                
                <div className="edit-modal-buttons-container d-flex">
                  <Button
                    variant="success"
                    onClick={handleSaveChanges}
                    className="edit-save-button">
                    Save Changes
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setShowEditModal(false)}
                    className="edit-cancel-button">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
        }

        {/* {showEditModal && selectedProgram && (
            <div className="edit-program-modal">
              <div className="edit-program-content">
                <h3>Edit Program</h3>
                <form>
                  <label>Program Name</label>
                  <input
                    type="text"
                    name="program_name"
                    value={selectedProgram.program_name}
                    onChange={handleFormChange}
                  />

                  <label>Program Description</label>
                  <textarea
                    name="description"
                    value={selectedProgram.description}
                    onChange={handleFormChange}
                  ></textarea>

                  <label>Program Type</label>
                  <input
                    type="text"
                    name="program_type"
                    value={selectedProgram.program_type}
                    onChange={handleFormChange}
                  />

                  <label>Program Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  <label>Program Ameneties</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAmenityImageUpload}
                    multiple
                  />

                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                  <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
                </form>
              </div>
            </div>
          )
        } */}
      </div >
    </div >
  );
};

export default ManageProgram;
