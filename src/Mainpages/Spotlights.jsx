import React, { useState, useEffect } from "react";
import { Breadcrumb, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Spotlight = () => {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const navigate = useNavigate();

  // Fetch photos for the carousel from /api/sk API
  useEffect(() => {
    const fetchCarouselPhotos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sk");
        setCarouselPhotos(response.data || []); // Ensure response is an array or fallback to an empty array
      } catch (error) {
        console.error("Error fetching carousel photos:", error);
        setCarouselPhotos([]); // Fallback to empty array
      }
    };

    fetchCarouselPhotos();
  }, []);

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/Home")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Hightlights</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">Spotlight</h1>
        <p className="Subtext">Celebrating SK Youth Excellent </p>
      </div>

      {/* Carousel Section */}
      <div className="d-flex justify-content-center">
        <div
          id="youthCarousel"
          className="carousel w-75 mb-2"
          data-bs-ride="carousel" // Bootstrap auto-slide functionality
          data-bs-interval="2000" // Auto-slide every 2 seconds
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
                  key={`${index}-${photo.image_url}`} // Use index and image_url as a unique key
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={photo.image_url}
                    className="d-block w-100"
                    alt={`SK Council Slide ${index + 1}`}
                    style={{
                      height: "450px", // Ensures equal height for all images
                      objectFit: "cover", // Maintains aspect ratio while filling the space
                    }}
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

      <div className="d-flex flex-column align-items-start ms-5">
        <h1 className="Maintext">SK WESTERN BICUTAN COUNSIL</h1>
        <p className="Subtext">Celebrating SK Youth Excellents </p>
      </div>

      <div className="bg-secondary">
        <div className="Divider">
          <h1 className="text-dark fw-bold fs-4">Milestones</h1>
        </div>
      </div>

      <div className="CardContainer">
        <Card className="MediumCard">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body className="d-flex flex-column align-items-center ">
            <Card.Title className="fs-5 fw-bold text-dark">
              Card Title
            </Card.Title>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Spotlight;
