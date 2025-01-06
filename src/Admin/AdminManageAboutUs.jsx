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
  const [imageCount, setImageCount] = useState(0); // State for image count

  // State for About Us details
  const [aboutDetails, setAboutDetails] = useState({
    description: "",
    mandate: "",
    mission: "",
    vision: "",
    objective: "",
    skCouncil: "",
    image_ur: { imageCount },
  });

  const [newAboutDetails, setNewAboutDetails] = useState({ ...aboutDetails });
  const [skCouncilInputs, setSkCouncilInputs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
  const [currentMember, setCurrentMember] = useState(null); // Track the current member being edited or added
  const [imageFile, setImageFile] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const aboutResponse = await axios.get("http://localhost:5000/Website");
        setAboutDetails(aboutResponse.data);
        setNewAboutDetails(aboutResponse.data);

        // Count the number of images in the image_url field
        const imageUrls = aboutResponse.data.image_url.match(
          /\/Asset\/SK_Photos\/[^,]+/g
        );
        setImageCount(imageUrls ? imageUrls.length : 0);

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

    // Normalize the image filename
    const normalizedImageFile = imageFile
      ? normalizeFilename(imageFile.name)
      : normalizeFilename(currentMember.image);

    // Check if the member already exists by normalized image path
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
        // For new members, create the member with image upload
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
        // For editing existing members, upload image and update the member's info
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

      setModalVisible(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving SK Council member", error);
      alert("Error saving SK Council member");
    }
  };

  const handleSave = async (e) => {
    await saveAboutDetails();
    await saveSkCouncilMembers();
    setActiveContent("manageAboutDetails"); // Switch back to manage view after saving
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
              {Object.keys(aboutDetails).map(
                (field, idx) =>
                  field !== "id" && ( // Exclude the 'id' field
                    <div className="admin-current-about-form" key={idx}>
                      <label className="admin-current-about-label">
                        {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </label>
                      <textarea
                        className="form-control"
                        value={aboutDetails[field]}
                        readOnly
                      />
                    </div>
                  )
              )}
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
              {Object.keys(newAboutDetails).map(
                (field, idx) =>
                  field !== "id" && ( // Exclude the 'id' field
                    <div className="admin-edit-about-form" key={idx}>
                      <label className="admin-edit-about-label">
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
            <div className="admin-about-details-group">
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
          </div>
        )}

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
                      e.preventDefault(); // Prevent page reload on submit
                      if (imageFile) {
                        saveSkCouncilMembers(); // Save the SK Council member when image is available
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
