import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageAboutUs.css';

const pageLabels = {
    manageAboutDetails: 'Manage About Us Details',
    editAboutDetails: 'Edit About Us Details'
};

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for About Us details
    const [aboutDetails, setAboutDetails] = useState({
        isked: '',
        sangguniangKabataan: '',
        mandate: '',
        mission: '',
        vision: '',
        objective: '',
        skCouncil: '',
        history: '',
        formerOfficials: '',
    });

    const [newAboutDetails, setNewAboutDetails] = useState({ ...aboutDetails });
    const [skCouncilInputs, setSkCouncilInputs] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
    const [currentMember, setCurrentMember] = useState(null); // Track the current member being edited or added

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const aboutResponse = await axios.get('http://localhost:5000/Website');
                setAboutDetails(aboutResponse.data);
                setNewAboutDetails(aboutResponse.data);

                const skCouncilResponse = await axios.get('http://localhost:5000/Skcouncil');
                setSkCouncilInputs(skCouncilResponse.data);
            } catch (error) {
                setError('Error fetching data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAboutDetailsChange = (field, value) => {
        setNewAboutDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSkCouncilInputChange = (field, value) => {
        setCurrentMember(prev => ({ ...prev, [field]: value }));
    };

    const addSkCouncilInput = () => {
        setCurrentMember({ id: '', name: '', age: '', position: '', description: '', image: '' });
        setModalVisible(true);
    };

    const editSkCouncilInput = (member) => {
        setCurrentMember({ ...member });
        setModalVisible(true);
    };

    const deleteSkCouncilInput = async (id) => {
        try {
            if (id) {
                await axios.delete(`http://localhost:5000/Skcouncil/${id}`);
            }
            setSkCouncilInputs(skCouncilInputs.filter(member => member.id !== id));
        } catch (error) {
            setError('Error deleting SK Council member');
            console.error(error);
        }
    };

    const saveSkCouncilMember = async () => {
        try {
          if (currentMember.id) {
            await axios.put(`http://localhost:5000/Skcouncil/${currentMember.id}`, currentMember);
          } else {
            const response = await axios.post('http://localhost:5000/Skcouncil', currentMember);
            // Assuming the response contains the new member's data
            setSkCouncilInputs(prev => [...prev, response.data]); // Add the new member to the list
          }
          setModalVisible(false); // Close modal after saving
        } catch (error) {
          setError('Error saving SK Council member');
          console.error(error);
        }
      };
      

    const saveAboutDetails = async () => {
        try {
            await axios.put('http://localhost:5000/Website', newAboutDetails);
            setAboutDetails(newAboutDetails);
            setActiveContent('manageAboutDetails');
        } catch (error) {
            setError('Error saving About Us details');
            console.error(error);
        }
    };

    const saveSkCouncilMembers = async () => {
        try {
            for (const member of skCouncilInputs) {
                if (member.id) {
                    await axios.put(`http://localhost:5000/Skcouncil/${member.id}`, member);
                } else {
                    await axios.post('http://localhost:5000/Skcouncil', member);
                }
            }
            setActiveContent('manageAboutDetails');
        } catch (error) {
            setError('Error saving SK Council members');
            console.error(error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent form refresh
        await saveAboutDetails();
        await saveSkCouncilMembers();
        setActiveContent('manageAboutDetails'); // Switch back to manage view after saving
    };

    return (
        <div className="admin-about-us-container">
            <div className="admin-about-us-label-and-button d-flex justify-content-between align-items-center">
                <h2 className="admin-about-us-label-h2 fst-italic">
                    {pageLabels[activeContent]}
                </h2>

                {activeContent !== 'manageAboutDetails' && (
                    <div className="admin-about-us-back-button">
                        <button
                            onClick={() => setActiveContent('manageAboutDetails')}
                            className="admin-edit-about-details-back-button rounded"
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>

            <div className="admin-about-us-contents-container d-flex justify-content-center">
                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                {activeContent === 'manageAboutDetails' && !loading && (
                    <div className="admin-current-about-details-container">
                        <div className="admin-about-details-group">
                            {Object.keys(aboutDetails).map((field, idx) => (
                                field !== 'id' && ( // Exclude the 'id' field
                                    <div className="admin-current-about-form" key={idx}>
                                        <label className="admin-current-about-label">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                                        <textarea className="form-control" value={aboutDetails[field]} readOnly />
                                    </div>
                                )
                            ))}
                            <button
                                onClick={() => setActiveContent('editAboutDetails')}
                                className="admin-edit-about-details-button rounded"
                            >
                                Edit Details
                            </button>

                            {/* SK Council Details Table */}
                            <div className="mt-4">
                                <h3>SK Council Members</h3>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Age</th>
                                            <th>Position</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skCouncilInputs.map((member, index) => (
                                            <tr key={index}>
                                                <td>{member.name}</td>
                                                <td>{member.description}</td>
                                                <td>{member.age}</td>
                                                <td>{member.position}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() => editSkCouncilInput(member)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteSkCouncilInput(member.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    onClick={addSkCouncilInput}
                                    className="btn btn-secondary mt-3"
                                >
                                    Add SK Council Member
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Add/Edit SK Council Member */}
                {modalVisible && (
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{currentMember.id ? 'Edit' : 'Add'} SK Council Member</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setModalVisible(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => { e.preventDefault(); saveSkCouncilMember(); }}>
                                        <div className="mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentMember.name}
                                                onChange={(e) => handleSkCouncilInputChange('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentMember.description}
                                                onChange={(e) => handleSkCouncilInputChange('description', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Age</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={currentMember.age}
                                                onChange={(e) => handleSkCouncilInputChange('age', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Position</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentMember.position}
                                                onChange={(e) => handleSkCouncilInputChange('position', e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            Save Member
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div className="admin-edit-about-details-container">
                        <form onSubmit={handleSave} className="admin-edit-about-details-group">
                            {Object.keys(newAboutDetails).map((field, idx) => (
                                field !== 'id' && ( // Exclude the 'id' field
                                    <div className="admin-edit-about-form" key={idx}>
                                        <label className="admin-edit-about-label">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                                        <textarea
                                            value={newAboutDetails[field]}
                                            onChange={(e) => handleAboutDetailsChange(field, e.target.value)}
                                        />
                                    </div>
                                )
                            ))}
                            <button
                                type="submit"
                                className="admin-save-about-details-button rounded text-white"
                            >
                                Save Details
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAboutUs;
