import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SKPhoto from "../Assets/Western Photo.png";

const Youth = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const carouselItems = [
    { src: "http://placehold.it/250/f44336/000000", alt: "Item 1", name: "John Doe", age: 25 },
    { src: "http://placehold.it/250/e91e63/000000", alt: "Item 2", name: "Jane Smith", age: 30 },
    { src: "http://placehold.it/250/9c27b0/000000", alt: "Item 3", name: "Alex Johnson", age: 28 },
    { src: "http://placehold.it/250/673ab7/000000", alt: "Item 4", name: "Maria Garcia", age: 22 },
    { src: "http://placehold.it/250/4caf50/000000", alt: "Item 5", name: "James Brown", age: 35 },
    { src: "http://placehold.it/250/8bc34a/000000", alt: "Item 6", name: "Emily White", age: 27 }
  ];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.dropdown')) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start">
        <h1 className="Maintext animated slideInRight">Former SK Officials</h1>
        <p className="Subtext">Visionary leaders who shaped our barangay</p>
      </div>

      {/* Dropdown controlled with state */}
      <div className="dropdown d-flex justify-content-start m-3 ">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          onClick={handleDropdownToggle}
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          Term
        </button>

        {showDropdown && (
          <div className="dropdown-menu show-end" aria-labelledby="dropdownMenuButton">
            <Link className="dropdown-item" to="#" onClick={handleDropdownItemClick}>
              Action
            </Link>
            <Link className="dropdown-item" to="#" onClick={handleDropdownItemClick}>
              Another action
            </Link>
            <Link className="dropdown-item" to="#" onClick={handleDropdownItemClick}>
              Something else here
            </Link>
          </div>
        )}
      </div>

      <div className="Former-img-container">
        <img src={SKPhoto} className="Former-main-img" alt="Cover" />
      </div>

      <div className="bg-secondary">
        <div className="Divider">
          <h1 className="Divider-Text">SK COUNCIL</h1>
        </div>
      </div>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        className="carousel-container"
      >
        {carouselItems.map((item, index) => (
          <div className="d-flex flex-column align-items-center m-5" key={index}>
            <img src={item.src} alt={item.alt} className="img-responsive" />
            <p className="mt-2"><strong>Name:</strong> {item.name}</p>
            <p><strong>Age:</strong> {item.age}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Youth;
