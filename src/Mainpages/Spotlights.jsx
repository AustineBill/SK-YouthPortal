import React, { useState, useEffect } from "react";
import { Breadcrumb, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Spotlight = () => {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const [spotlightData, setSpotlightData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarouselPhotos = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/api/sk"
        );
        setCarouselPhotos(response.data || []); // Ensure response is an array or fallback to an empty array
      } catch (error) {
        console.error("Error fetching carousel photos:", error);
        setCarouselPhotos([]); // Fallback to empty array
      }
    };

    fetchCarouselPhotos();
  }, []);

  useEffect(() => {
    const fetchSpotlightData = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/spotlight"
        );
        console.log(response.data); // Log the response
        setSpotlightData(response.data);
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
        setSpotlightData([]); // Fallback to empty array
      }
    };

    fetchSpotlightData();
  }, []);

  return (
    <div className="container-fluid">
      {/* Breadcrumb */}
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/Home")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Highlights</Breadcrumb.Item>
      </Breadcrumb>

      {/* Title Section */}
      <div className="text-center text-lg-start m-4">
        <h1 className="Maintext animated slideInRight">Spotlight</h1>
        <p className="Subtext">Celebrating SK Youth Excellence</p>
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
                      height: "580px", // Ensures equal height for all images
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

      <div className="bg-custom mt-2.5">
        <div className="Divider">
          <h1 className="text-light fw-bold fs-4">Spotlight</h1>
        </div>
      </div>

      {/* Cards Sectioon */}
      <div className="d-flex flex-wrap justify-content-center">
        {spotlightData.length > 0 ? (
          spotlightData.map((spotlight, index) =>
            (spotlight.images || []).map((image, imgIndex) => (
              <Card className="MediumCard m-3" key={`${index}-${imgIndex}`}>
                <Card.Img
                  variant="top"
                  src={image}
                  alt={`Spotlight ${imgIndex + 1}`}
                  style={{ height: "250px", objectFit: "cover" }}
                />
              </Card>
            ))
          )
        ) : (
          <p className="text-center text-muted py-5">No Spotlight available</p>
        )}
      </div>
    </div>
  );
};

export default Spotlight;
