import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import './styles/ManageProgram.css'
import './styles/AdminManageProgram.css';

const ManageProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [activeContent, setActiveContent] = useState('allPrograms');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newProgram, setNewProgram] = useState({ name: '', description: '', imageUrl: '' });
    const [imagePreview, setImagePreview] = useState(null);

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

    const handleSaveChanges = () => {
        // Update the program in the programs list
        setPrograms((prev) =>
            prev.map((program) =>
                program.id === selectedProgram.id ? selectedProgram : program
            )
        );
        setShowEditModal(false); // Close the edit modal
    };

    const handleDeleteProgram = (programId) => {
        setPrograms(programs.filter((program) => program.id !== programId));
        setSelectedProgram(null);
    };

    const handleNewProgramChange = (e) => {
        const { name, value } = e.target;
        setNewProgram((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewProgram((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleAddProgram = () => {
        const newProgramWithId = { ...newProgram, id: `${programs.length + 1}` };
        setPrograms([...programs, newProgramWithId]);
        setNewProgram({ name: '', description: '', imageUrl: '' });
        setImagePreview(null);
        setActiveContent('allPrograms');
    };

    return (
        <div className="admin-manage-program-container">
            <div className='program-label'>
                <h2>Manage Programs</h2>
            </div>
            
            <ul className="program-nav-tabs">
                <li onClick={() => setActiveContent('allPrograms')}>All Programs</li>
                <li onClick={() => setActiveContent('addProgram')}>Add Program</li>
            </ul>

            <div className="program-component-contents">
                {activeContent === 'allPrograms' && (
                    <div className="admin-programs-list">
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
                                                                <h3>{program.name}</h3>
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
                                <img src={selectedProgram.imageUrl || 'https://via.placeholder.com/100'} alt={selectedProgram.name || "Program"} />
                                <h3>{selectedProgram.name || 'Program Name'}</h3>
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

                {activeContent === 'addProgram' && (
                    <div className="admin-add-program">
                        <form>
                            <label>Program Name</label>
                            <input
                                type="text"
                                placeholder="Program Name"
                                name="name"
                                value={newProgram.name}
                                onChange={handleNewProgramChange}
                            />
                            <label>Program Description</label>
                            <input
                                type="text"
                                placeholder="Program Description"
                                name="description"
                                value={newProgram.description}
                                onChange={handleNewProgramChange}
                            />
                            <label>Pictures</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="admin-image-preview" />}
                            <button type="button" id="add-program-button" onClick={handleAddProgram}>
                                Add Program
                            </button>
                        </form>
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
                            value={selectedProgram.name}
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