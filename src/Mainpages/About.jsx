import React, { useState, useEffect } from "react";
import axios from "axios";

const About = () => {
  const [description, setDescription] = useState("");
  const [carouselPhotos, setCarouselPhotos] = useState([]); // Default to an empty array
  const [showMore, setShowMore] = useState(false); // Toggle for Read More functionality
  const maxInitialLength = 1000; // Set the number of characters to show initially

  // Fetch description from /Website API
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/Website");
        setDescription(response.data.description || ""); // Handle case where description might be undefined
      } catch (error) {
        console.error("Error fetching description:", error);
        setDescription("Error loading description"); // Fallback in case of error
      }
    };

    fetchDescription();
  }, []);

  // Fetch photos for the carousel from /api/sk API
  useEffect(() => {
    const fetchCarouselPhotos = async () => {
      try {
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/api/sk");
        setCarouselPhotos(response.data || []); // Ensure response is an array or fallback to an empty array
      } catch (error) {
        console.error("Error fetching carousel photos:", error);
        setCarouselPhotos([]); // Fallback to empty array
      }
    };

    fetchCarouselPhotos();
  }, []);

  // Initialize the carousel to ensure it auto-slides
  useEffect(() => {
    const carouselElement = document.querySelector("#youthCarousel");
    if (carouselElement) {
      // Initialize the Bootstrap carousel
      new window.bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 2000, // Auto-slide every 2 seconds
      });
    }
  }, []);

  // Toggle text visibility (show more or less)
  const handleToggle = () => {
    setShowMore(!showMore); // Toggle the value of showMore
  };

  // Truncate description if not "showMore"
  const truncatedDescription =
    description.length > maxInitialLength && !showMore
      ? description.slice(0, maxInitialLength) + "..."
      : description;

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">SK Youth</h1>
        <p className="Subtext">The Team at your Service.</p>
      </div>

      {/* Carousel Section */}
      <div className="d-flex justify-content-center">
        <div
          id="youthCarousel"
          className="carousel"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-indicators">
            {carouselPhotos.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#youthCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {carouselPhotos.length > 0 ? (
              carouselPhotos.map((photo, index) => (
                <div
                  key={`${index}-${photo.image_url}`}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={photo.image_url}
                    className="d-block w-100"
                    alt={`SK Council Slide ${index + 1}`}
                    style={{ height: "570px", width: "auto", margin: "0 auto" }}
                  />
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <p className="text-center text-light py-5">
                  No images available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="youth-container">
        <h1 className="youth-head">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
        <div className="youth-text-wrapper">
          <p className="youth-text-content text-justify">
            {truncatedDescription}
          </p>
          {/* Read More button */}
          {description.length > maxInitialLength && (
            <button className="btn-toggle" onClick={handleToggle}>
              {showMore ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
