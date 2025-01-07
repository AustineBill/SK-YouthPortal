import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/AdminManageAboutUs.css";

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

      <div className="admin-about-us-contents-container d-flex justify-content-center">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {activeContent === "manageAboutDetails" && !loading && (
          <div className="admin-current-about-details-container">
            <div className="admin-about-details-group">
              {/* Custom section for each field */}
              <div className="admin-description-form">
                <label className="admin-description-label">Description</label>
                <textarea
                  className="admin-description-textarea form-control"
                  value={aboutDetails.description}
                  readOnly
                />
              </div>

              <div className="admin-mandate-form">
                <label className="admin-mandate-label">Mandate</label>
                <textarea
                  className="admin-mandate-textarea form-control"
                  value={aboutDetails.mandate}
                  readOnly
                />
              </div>

              <div className="admin-mission-form">
                <label className="admin-mission-label">Mission</label>
                <textarea
                  className="admin-mission-textarea form-control"
                  value={aboutDetails.mission}
                  readOnly
                />
              </div>

              <div className="admin-vision-form">
                <label className="admin-vision-label">Vision</label>
                <textarea
                  className="admin-vision-textarea form-control"
                  value={aboutDetails.vision}
                  readOnly
                />
              </div>

              <div className="admin-objectives-form">
                <label className="admin-objectives-label">Objectives</label>
                <textarea
                  className="admin-objectives-textarea form-control"
                  value={aboutDetails.objectives}
                  readOnly
                />
              </div>

              <div className="admin-objectives-form">
                <label className="admin-photos-label">Objectives</label>
                <div className="mb-3">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleImageChange(e)}
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveContent("editAboutDetails")}
                className="admin-edit-about-details-button rounded"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {activeContent === "editAboutDetails" && (
          <div className="admin-edit-about-details-container">
            <form
              onSubmit={handleSave}
              className="admin-edit-about-details-group"
            >
              {/* Editable fields */}
              {Object.keys(newAboutDetails).map(
                (field, idx) =>
                  field !== "id" && (
                    <div className={`admin-${field}-form`} key={idx}>
                      <label className={`admin-${field}-label`}>
                        {field.replace(/([A-Z])/g, " $1").toUpperCase()}
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
          <div className="admin-current-about-details-container">
            <h3>SK Council Members</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skCouncilInputs.map((member, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={member.image}
                        alt={`SK Member ${index + 1}`}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => editSkCouncilInput(member)}
                      >
                        Edit
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
                    <div className="mb-3">
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
