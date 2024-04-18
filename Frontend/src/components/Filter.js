import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

//Filter offer
const Filter = ({
  address,
  minPrice,
  maxPrice,
  setOffers,
  setAddress,
  setMinPrice,
  setMaxPrice,
  setFcategory,
  categories,
  fcategory,
  fetchOffers,
  min,
  max,
}) => {
  const reset = () => {
    setFcategory(null);
    setAddress("");
    setMinPrice("");
    setMaxPrice("");
    fetchOffers();
  }; 
  const [sliderValue, setSliderValue] = useState([minPrice, maxPrice]);
  const handleSliderChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "70%",
        maxWidth: "600px",
        margin: "auto",
        marginTop: "65px",
      }}
    >
      <h2
        style={{
          marginTop: "3rem",
          marginBottom: "1rem",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        {/* Search Offers */}
      </h2>
      <Accordion
        className="accordion-filter accordion-inner"
        defaultActiveKey="0"
      >
        <Accordion.Item>
          <Accordion.Header>Category</Accordion.Header>
          <Accordion.Body>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {categories &&
                categories.map((cat) => (
                  <li key={cat._id} style={{ marginBottom: "0.5rem" }}>
                    <Link
                      to="#"
                      onClick={() => setFcategory(cat._id)}
                      style={{
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "1rem",
                      }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div style={{ width: "100%", marginBottom: "1rem", marginTop: "-20px" }}>
        <label
          htmlFor="address"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Address:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      {/* <div style={{ width: "100%", marginBottom: "1rem" }}>
        <label
          htmlFor="minPrice"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Min Price:
        </label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={{ width: "100%", marginBottom: "1rem" }}>
        <label
          htmlFor="maxPrice"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Max Price:
        </label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div> */}
      <div style={{ width: "100%", marginBottom: "1rem" }}>
        <label
          htmlFor="minPrice"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Min Price:
        </label>
        <Slider
          min={min}
          max={max}
          value={minPrice}
          onChange={(value) => setMinPrice(value)}
        />
        <div style={{ marginTop: "0.5rem" }}>
          <span style={{ fontWeight: "bold" }}>{minPrice}</span>
          <span style={{ marginLeft: "0.5rem" }}>Euro</span>
        </div>
      </div>
      <div style={{ width: "100%", marginBottom: "1rem" }}>
        <label
          htmlFor="maxPrice"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Max Price:
        </label>
        <Slider
          min={min}
          max={max}
          value={maxPrice}
          onChange={(value) => setMaxPrice(value)}
        />
        <div style={{ marginTop: "0.5rem" }}>
          <span style={{ fontWeight: "bold" }}>{maxPrice}</span>
          <span style={{ marginLeft: "0.5rem" }}>Euro</span>
        </div>
      </div>
    

      <div className="row filter-buttons" style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Link
            to={"#"}
            className="btn btn-outline-secondary btnhover mt-3 d-block"
            onClick={reset}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "5px",
              border: "1px solid #ccc",
              textDecoration: "none",
              color: "#333",
              textAlign: "center",
            }}
          >
            Reset Filter
          </Link>
        </div>
      </div>
      {/* <button type="submit">Filter</button> */}
    </form>
  );
};

export default Filter;
