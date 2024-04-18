import React from "react";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";

const FilterInfluencer = ({
  contents,
  setContents,
  city,
  fcontent,
  setCity,
  setFcontent,
  fetchUsers,
  setPublics,
  audienceAges,
  publics,
  setAudienceAges,
  setFaudience,
  setFpublic


}) => {
  const reset = () => {
    setFcontent(null);
    setCity("");
    setFaudience(null)
    setFpublic(null)
    fetchUsers();
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
        marginTop: "70px",
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
        Search Influencer
      </h2>
      <Accordion
        className="accordion-filter accordion-inner theme-dark-bg"
        defaultActiveKey="0"
        style={{ marginBottom: "5px",width:"200px" }}
      >
        <Accordion.Item>
          <Accordion.Header>Content</Accordion.Header>
          <Accordion.Body>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
               
              }}
            >
              {contents &&
                contents.map((cat) => (
                  <li key={cat._id} >
                    <Link
                      to="#"
                      onClick={() => setFcontent(cat._id)}
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
      <Accordion
        className="accordion-filter accordion-inner"
        defaultActiveKey="0"
        style={{ marginBottom: "5px",width:"200px" }}
      >
        <Accordion.Item>
          <Accordion.Header>Public</Accordion.Header>
          <Accordion.Body>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
               
              }}
            >
              {publics &&
                publics.map((cat) => (
                  <li key={cat._id} >
                    <Link
                      to="#"
                      onClick={() => setFpublic(cat._id)}
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
      <Accordion
        className="accordion-filter accordion-inner theme-dark-bg"  
        defaultActiveKey="0"
        style={{ marginBottom: "25px",width:"200px"}}
      >
        <Accordion.Item>
          <Accordion.Header>Audience-Ages</Accordion.Header>
          <Accordion.Body>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                
              }}
             
            >
              {audienceAges &&
                audienceAges.map((cat) => (
                  <li key={cat._id} style={{ marginBottom: "0.5rem" }}>
                    <Link
                      to="#"
                      onClick={() => setFaudience(cat._id)}
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
      <div style={{ width:"200px", marginBottom: "1rem", marginTop: "-20px" }}>
        <label
          htmlFor="address"
          style={{
            marginBottom: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
          
        >
          City:
        </label>
        <input
          type="text"
          id="address"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
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

export default FilterInfluencer;
