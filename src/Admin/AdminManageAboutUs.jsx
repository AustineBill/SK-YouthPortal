import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageAboutUs.css';

const pageLabels = {
    manageAboutDetails: 'Manage About Us Details',
    editAboutDetails: 'Edit About Us Details'
};

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');
    const [description, setDescription] = useState('');
    const [newDescription, setNewDescription] = useState('');
    // NEW CODES: useState for SK Council Inputs
    const [skCouncilInputs, setSkCouncilInputs] = useState([]);

    // NEW CODES: Add new SK Council member input
    const addSkCouncilInput = () => {
        setSkCouncilInputs([...skCouncilInputs, { name: '', description: '', image: '' }]);
    };

    // NEW CODES: Handle changes to SK Council inputs
    const handleSkCouncilInputChange = (index, field, value) => {
        const updatedInputs = [...skCouncilInputs];
        updatedInputs[index][field] = value; // Update specific field
        setSkCouncilInputs(updatedInputs);
    };

    // NEW CODES: Delete an SK Council input
    const deleteSkCouncilInput = (index) => {
        const updatedInputs = skCouncilInputs.filter((_, i) => i !== index);
        setSkCouncilInputs(updatedInputs);
    };

    // Fetch description on component mount
    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await axios.get('http://localhost:5000/Website/description');
                setDescription(response.data.description);
                setNewDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching description:', error);
            }
        };

        fetchDescription();
    }, []);

    // NEW CODES: Save functionality (BASED ON ChatGPT, Pakitry ipasok to dun sa logic)
    // const saveDescription = (e) => {
    //     e.preventDefault();
    //     console.log('Saving description and SK Council inputs:', { newDescription, skCouncilInputs });
    // };

    // Save updated description
    const saveDescription = async () => {
        try {
            await axios.put('http://localhost:5000/Website/description', { description: newDescription });
            setDescription(newDescription);
            setActiveContent('manageAboutDetails');
        } catch (error) {
            console.error('Error saving description:', error);
        }
    };

    return (
        <div className='admin-about-us-container'>
            <div className='admin-about-us-label-and-button d-flex justify-content-between align-items-center'>
                <h2 className='admin-about-us-label-h2 fst-italic'>
                    {pageLabels[activeContent]}
                </h2>

                {activeContent !== 'manageAboutDetails' && (
                    <div className='admin-about-us-back-button'>
                        <button
                            onClick={() => setActiveContent('manageAboutDetails')}
                            className='admin-edit-about-details-back-button rounded'>
                            Back
                        </button>
                    </div>
                )}
            </div>

            <div className='admin-about-us-contents-container d-flex justify-content-center'>
                {activeContent === 'manageAboutDetails' && (
                    <div className='admin-current-about-details-container d-flex justify-content-center'>
                        {/* Group of Current About Details Form */}
                        <div className='admin-about-details-group d-flex flex-column align-items-center'>
                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>iSKed</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>SANGGUNIANG KABATAAN - WESTERN BICUTAN</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>Mandate</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>Mission</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>Vision</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>Objective</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>SK COUNCIL DITO! WALA PANG OUTPUT!</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>HISTORY DITO! WALA PANG OUTPUT!</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <div className='admin-current-about-form d-flex flex-column'>
                                <label className='admin-current-about-label'>FORMER SK OFFICIALS DITO! WALA PANG OUTPUT!</label>
                                <textarea
                                    className='form-control'
                                    value={description}
                                />
                            </div>

                            <button
                                onClick={() => setActiveContent('editAboutDetails')}
                                className='admin-edit-about-details-button rounded'>
                                Edit Details
                            </button>
                        </div>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div className='admin-edit-about-details-container d-flex justify-content-center'>
                        {/* Group of Edit About Details Form */}
                        <form className='admin-edit-about-details-group d-flex flex-column align-items-center'>
                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>iSKed</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>SANGGUNIANG KABATAAN - WESTERN BICUTAN</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>Mandate</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>Mission</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>Vision</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>Objective</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>


















                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>SK Council</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            {/* Render dynamic SK Council inputs */}
                            {skCouncilInputs.map((input, index) => (
                                <div className="admin-edit-about-form d-flex flex-column mt-3" key={index}>
                                    <label className="admin-edit-about-label">SK Council Member {index + 1}</label>
                                    {/* Name Input */}
                                    <textarea
                                        value={input.name}
                                        onChange={(e) => handleSkCouncilInputChange(index, 'name', e.target.value)}
                                        className="form-control mb-2"
                                        placeholder="Enter name"
                                    />
                                    {/* Description Input */}
                                    <textarea
                                        value={input.description}
                                        onChange={(e) => handleSkCouncilInputChange(index, 'description', e.target.value)}
                                        className="form-control mb-2"
                                        placeholder="Enter description"
                                    />
                                    {/* Image URL Input */}
                                    <input
                                        type="image"
                                        value={input.image}
                                        onChange={(e) => handleSkCouncilInputChange(index, 'image', e.target.value)}
                                        className="form-control mb-2"
                                        placeholder="Enter image URL"
                                    />

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => deleteSkCouncilInput(index)}
                                        className="btn btn-danger btn-sm mt-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {/* Button to add a new SK Council member */}
                            <button
                                type="button"
                                onClick={addSkCouncilInput}
                                className="btn btn-secondary mt-3"
                            >
                                Add SK Council Member
                            </button>
















                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>HISTORY DITO! WALA PANG OUTPUT!</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <div className='admin-edit-about-form d-flex flex-column'>
                                <label className='admin-edit-about-label'>FORMER SK OFFICIALS DITO! WALA PANG OUTPUT!</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>

                            <button onClick={saveDescription}
                                className='admin-save-about-details-button rounded text-white'>
                                Save Details
                            </button>
                        </form>
                    </div>
                )
                }
            </div >
        </div >
    );
};

export default ManageAboutUs;
