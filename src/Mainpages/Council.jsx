import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";

const Council = () => {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const [councilMembers, setCouncilMembers] = useState([]);
  const navigate = useNavigate();

  // Fetch photos for the carousel from /api/sk API
  useEffect(() => {
    const fetchCarouselPhotos = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/api/sk"
        );
        setCarouselPhotos(response.data || []); // Ensure response is an array or fallback to an empty array
      } catch (error) {
        setCarouselPhotos([]); // Fallback to empty array
      }
    };

    fetchCarouselPhotos();
  }, []);

  useEffect(() => {
    const fetchCouncilMembers = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/Skcouncil"
        );
        setCouncilMembers(response.data);
      } catch (error) {
        console.error("Error fetching SK Council members:", error);
      }
    };

    fetchCouncilMembers();
  }, []);

  // Responsive settings for React Multi-Carousel
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/About")}>
          About
        </Breadcrumb.Item>
        <Breadcrumb.Item active>SK Council</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">SK Council</h1>
        <p className="Subtext">Visionary leaders who shaped our barangay.</p>
      </div>

      {/* Carousel Section */}
      <div className="d-flex justify-content-center mb">
        <div
          id="youthCarousel"
          className="carousel"
          data-bs-ride="carousel"
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

      <div className="bg-custom mt-2.5">
        <div className="Divider">
          <h1 className="text-light fw-bold fs-4">SK COUNCIL</h1>
        </div>
      </div>

      {/* Council Members Carousel */}
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        className="carousel-container"
      >
        {councilMembers.map((item, index) => (
          <div
            className="d-flex flex-column align-items-center m-4"
            key={index}
          >
            <img
              src={item.image}
              alt={`SK Council Member ${index + 1}`}
              className="img-responsive"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                marginTop: "25px",
                marginBottom: "25px",
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Council;
