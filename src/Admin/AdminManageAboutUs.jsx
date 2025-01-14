import { useState, useEffect } from "react";
import axios from "axios";
// import "./styles/AdminManageAboutUs.css";
import '../WebStyles/Admin-CSS.css';

const pageLabels = {
  manageAboutDetails: "Manage About Us Details",
  editAboutDetails: "Edit About Us Details",
};

const ManageAboutUs = () => {
  const [activeContent, setActiveContent] = useState("manageAboutDetails");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageCount, setImageCount] = useState(0);

  // State for About Us details
  const [aboutDetails, setAboutDetails] = useState({
    description: "",
    mandate: "",
    mission: "",
    vision: "",
    objectives: "", // Changed objective to objectives to match DB
    skCouncil: "",
    image_ur: { imageCount },
  });

  const [newAboutDetails, setNewAboutDetails] = useState({ ...aboutDetails });
  const [skCouncilInputs, setSkCouncilInputs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const aboutResponse = await axios.get("http://localhost:5000/Website");

        // Log the response to check the fetched data
        console.log("Fetched data:", aboutResponse.data);

        // Ensure the objectives field is in the response
        setAboutDetails(aboutResponse.data);
        setNewAboutDetails(aboutResponse.data);

        // Check if image URLs exist and count them
        const imageUrls = aboutResponse.data.image_url.match(
          /\/Asset\/SK_Photos\/[^,]+/g
        );
        setImageCount(imageUrls ? imageUrls.length : 0);

        // Fetch SK Council members
        const skCouncilResponse = await axios.get(
          "http://localhost:5000/Skcouncil"
        );
        setSkCouncilInputs(skCouncilResponse.data);
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAboutDetailsChange = (field, value) => {
    setNewAboutDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addSkCouncilInput = () => {
    setCurrentMember({ id: "", image: "" });
    setModalVisible(true);
  };

  const editSkCouncilInput = (member) => {
    setCurrentMember({ ...member });
    setModalVisible(true);
  };

  const saveAboutDetails = async () => {
    try {
      await axios.put("http://localhost:5000/Website", newAboutDetails);
      setAboutDetails(newAboutDetails);
      setActiveContent("manageAboutDetails");
    } catch (error) {
      setError("Error saving About Us details");
      console.error(error);
    }
  };

  const normalizeFilename = (filename) => {
    return filename.replace(/\s+/g, "_"); // Replace spaces with underscores
  };

  const saveSkCouncilMembers = async () => {
    if (!imageFile && !currentMember.image) {
      alert("Please select an image file before saving.");
      return;
    }

    const normalizedImageFile = imageFile
      ? normalizeFilename(imageFile.name)
      : normalizeFilename(currentMember.image);

    const memberExists = skCouncilInputs.some(
      (member) => normalizeFilename(member.image) === normalizedImageFile
    );

    if (memberExists) {
      alert("This member's image already exists.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile || currentMember.image);

    try {
      if (!currentMember.id) {
        const response = await axios.post(
          "http://localhost:5000/Skcouncil",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSkCouncilInputs((prevMembers) => [
          ...prevMembers,
          { ...response.data, image: response.data.image },
        ]);
      } else {
        const response = await axios.put(
          `http://localhost:5000/Skcouncil/${currentMember.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedMember = response.data;
        setSkCouncilInputs((prevMembers) =>
          prevMembers.map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          )
        );
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error saving SK Council member", error);
      alert("Error saving SK Council member");
    }
  };

  const handleSave = async (e) => {
    await saveAboutDetails();
    await saveSkCouncilMembers();
    setActiveContent("manageAboutDetails");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the selected file
    }
  };

  return (
    <div className="admin-about-us-container">
      <div className="admin-about-us-label-and-button d-flex justify-content-between align-items-center">
        <h2 className="admin-about-us-label-h2 fst-italic">
          {pageLabels[activeContent]}
        </h2>

        {activeContent !== "manageAboutDetails" && (
          <div className="admin-about-us-back-button">
            <button
              onClick={() => setActiveContent("manageAboutDetails")}
              className="admin-edit-about-details-back-button rounded"
            >
              Back
            </button>
          </div>
        )}
      </div>

      <div className="admin-about-us-contents-container d-flex flex-column align-items-center">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {activeContent === "manageAboutDetails" && !loading && (
          <div className="admin-current-about-details-container d-flex justify-content-center">
            <div className="admin-about-details-group d-flex flex-column align-items-center">
              {/* Custom section for each field */}
              <div className="admin-current-about-form d-flex flex-column">
                <label className="admin-current-about-label">Description</label>
                <textarea
                  className="admin-description-textarea"
                  value={aboutDetails.description}
                  readOnly
                />
              </div>

              <div className="admin-current-about-form d-flex flex-column">
                <label className="admin-current-about-label">Mandate</label>
                <textarea
                  className="admin-mandate-textarea"
                  value={aboutDetails.mandate}
                  readOnly
                />
              </div>

              <div className="admin-current-about-form d-flex flex-column">
                <label className="admin-current-about-label">Mission</label>
                <textarea
                  className="admin-mission-textarea"
                  value={aboutDetails.mission}
                  readOnly
                />
              </div>

              <div className="admin-current-about-form d-flex flex-column">
                <label className="admin-current-about-label">Vision</label>
                <textarea
                  className="admin-vision-textarea"
                  value={aboutDetails.vision}
                  readOnly
                />
              </div>

              <div className="admin-current-about-form d-flex flex-column">
                <label className="admin-current-about-label">Objectives</label>
                <textarea
                  className="admin-objectives-textarea"
                  value={aboutDetails.objectives}
                  readOnly
                />
              </div>

              <div className="admin-current-about-form d-flex flex-column">
                {/* <label className="admin-current-about-label">Objectives</label> */}
                <label>Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleImageChange(e)}
                />
              </div>

              <button
                onClick={() => setActiveContent("editAboutDetails")}
                className="admin-edit-about-details-button rounded">
                Edit Details
              </button>
            </div>
          </div>
        )}

        {activeContent === "editAboutDetails" && (
          <div className="admin-edit-about-details-container d-flex justify-content-center">
            <form
              onSubmit={handleSave}
              className="admin-edit-about-details-group"
            >
              {/* Editable fields */}
              {Object.keys(newAboutDetails).map(
                (field, idx) =>
                  field !== "id" && (
                    <div className={`admin-edit-${field}-form d-flex flex-column`} key={idx}>
                      <label className={`admin-edit-${field}-label`}>
                        {field.replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                          .replace(/^\w|\s\w/g, (match) => match.toUpperCase())}
                      </label>
                      <textarea
                        value={newAboutDetails[field]}
                        onChange={(e) =>
                          handleAboutDetailsChange(field, e.target.value)
                        }
                      />
                    </div>
                  )
              )}
              
              <button
                type="submit"
                className="admin-save-about-details-button rounded text-white"
              >
                Save Details
              </button>
            </form>
          </div>
        )}

        {activeContent === "manageAboutDetails" && !loading && (
          <div className="admin-current-SK-details-container d-flex flex-column align-items-center">
            <div className="admin-current-SK-label-container">
              <h2 className="SK-label-h2">SK Council Members</h2>
            </div>

            <table className="admin-SK-table table-bordered">
              <thead className="admin-SK-table-head text-center">
                <tr>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="admin-SK-table-body text-center">
                {skCouncilInputs.map((member, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={member.image}
                        alt={`SK Member ${index + 1}`}
                        style={{ width: "150px", height: "auto" }}
                      />
                    </td>
                    <td>
                      <button
                        className="admin-SK-edit-button bg-primary text-white rounded-pill"
                        onClick={() => editSkCouncilInput(member)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for managing SK Council members */}
        {modalVisible && (
          <div className="modal" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentMember.id ? "Edit" : "Add"} SK Council Member
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (imageFile) {
                      saveSkCouncilMembers();
                    } else {
                      alert("Please upload an image");
                    }
                  }}
                >
                  <div className="">
                    <label>Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Member
                  </button>
                  {/* Close button outside onSubmit */}
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setModalVisible(false)}
                  >
                    Close
                  </button>
                </form>
               </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAboutUs;
