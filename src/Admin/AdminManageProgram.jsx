import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios'; // Import axios
import './styles/AdminManageProgram.css';

const ManageProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [activeContent, setActiveContent] = useState('allPrograms');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newProgram, setNewProgram] = useState({ name: '', description: '', imageBase64: '' });
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch all programs from backend using axios
    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/programs');
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    // Utility function to convert image to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedPrograms = Array.from(programs);
        const [removed] = reorderedPrograms.splice(result.source.index, 1);
        reorderedPrograms.splice(result.destination.index, 0, removed);
        setPrograms(reorderedPrograms);
    };

    const handleEditProgram = (program) => {
        setSelectedProgram(program);
        setShowEditModal(true); // Show the edit modal
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setSelectedProgram((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/programs/${selectedProgram.id}`, selectedProgram);
            const updatedProgram = response.data;
            setPrograms((prev) =>
                prev.map((program) =>
                    program.id === updatedProgram.id ? updatedProgram : program
                )
            );
            setShowEditModal(false); // Close the edit modal
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleDeleteProgram = async (programId) => {
        try {
            await axios.delete(`http://localhost:5000/programs/${programId}`);
            setPrograms(programs.filter((program) => program.id !== programId));
            setSelectedProgram(null);
        } catch (error) {
            console.error('Error deleting program:', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setNewProgram((prev) => ({ ...prev, imageBase64: base64 }));
                setImagePreview(base64);
            } catch (error) {
                console.error('Error converting image to Base64:', error);
            }
        }
    };

    const handleAddProgram = async () => {
        const programData = {
            program_name: newProgram.name,
            description: newProgram.description,
            image_base64: newProgram.imageBase64,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/programs', programData);
            console.log('Program added:', response.data);
            setPrograms((prev) => [...prev, response.data]);
            setNewProgram({ name: '', description: '', imageBase64: '' });
            setImagePreview(null);
            setActiveContent('allPrograms');
        } catch (error) {
            console.error('Error adding program:', error);
            alert('There was an error adding the program.');
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
                {activeContent === 'allPrograms' && (
                    <div className="admin-programs-details-container d-flex flex-column">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="programs">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {programs.length === 0 ? (
                                            <p>No programs available</p>
                                        ) : (
                                            programs.map((program, index) => (
                                                <Draggable key={program.id} draggableId={program.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="admin-program-item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className="admin-program-info">
                                                                <h3>{program.program_name}</h3>
                                                                <button onClick={() => setSelectedProgram(program)}>
                                                                    View Details
                                                                </button>
                                                                <button onClick={() => handleEditProgram(program)}>
                                                                    Edit Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {selectedProgram && (
                            <div className="admin-program-details">
                                <img src={selectedProgram.image_base64 || 'https://via.placeholder.com/100'} alt={selectedProgram.program_name || "Program"} />
                                <h3>{selectedProgram.program_name || 'Program Name'}</h3>
                                <p>{selectedProgram.description || 'Program Description'}</p>
                                <div className="admin-program-details-buttons">
                                    <button className="btn btn-warning" onClick={() => handleEditProgram(selectedProgram)}>
                                        Edit Details
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteProgram(selectedProgram.id)}>
                                        Delete Program
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Program Section */}
                {activeContent === 'addProgram' && (
                    <div className="admin-add-program-container d-flex flex-column align-items-center">
                        <form className="admin-add-program-group align-items-center">
                            <label className="admin-add-program-label">Program Name</label>
                            <input
                                type="text"
                                placeholder="Program Name"
                                name="name"
                                value={newProgram.name}
                                onChange={(e) =>
                                    setNewProgram((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />

                            <label className="admin-add-program-label">Program Description</label>
                            <textarea
                                placeholder="Program Description"
                                name="description"
                                value={newProgram.description}
                                onChange={(e) =>
                                    setNewProgram((prev) => ({ ...prev, description: e.target.value }))
                                }
                            />

                            <label className="admin-add-program-label">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </form>

                        {imagePreview && (
                            <div className="adminprogrampage-image-preview-container">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="admin-image-preview"
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleAddProgram}
                            className="admin-add-program-button bg-success rounded-pill"
                        >
                            Add Program
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Program Modal */}
            {showEditModal && selectedProgram && (
                <div className="edit-modal">
                    <h3>Edit Program</h3>
                    <form>
                        <label>Program Name</label>
                        <input
                            type="text"
                            name="name"
                            value={selectedProgram.program_name}
                            onChange={handleFormChange}
                        />
                        <label>Program Description</label>
                        <input
                            type="text"
                            name="description"
                            value={selectedProgram.description}
                            onChange={handleFormChange}
                        />
                        <button type="button" onClick={handleSaveChanges}>
                            Save Changes
                        </button>
                        <button type="button" onClick={() => setShowEditModal(false)}>
                            Close
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProgram;
