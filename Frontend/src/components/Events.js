import React, { Component, useEffect, useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { AuthContext } from "../shared/authContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

//partie les comptes social media

const Events = () => {
  const [error, setError] = useState();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formdata, setFormData] = useState({
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    linkedinUrl: "",
    owner: auth.userId,
  });

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/social/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        
        setFormData(result.user);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth.userId]);

  return (
    
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Social Media</h4>
      </div>
      {/*              
                <div  className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                    <div className="bg-success me-2 p-3 rounded-xxl" ></div>
                    <h4 className="fw-700 text-grey-900 font-xssss mt-2">Facebook  </h4>
                </div> */}

   
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaFacebookF style={{ marginLeft: "-10px" }} />
        </i>
        <a
          href={formdata.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.facebookUrl}
          </h4>
        </a>
      </div>
 
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaInstagram style={{ marginLeft: "-10px" }} />
        </i>
        <a
          href={formdata.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.instagramUrl}
          </h4>
        </a>
      </div>
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaLinkedin style={{ marginLeft: "-10px" }} />
        </i>
        <a href={formdata.linkedinUrl} target="_blank" rel="noopener noreferrer">
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.linkedinUrl}
          </h4>
        </a>
      </div>
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaTwitter style={{ marginLeft: "-10px" }} />
        </i>
        <a href={formdata.twitterUrl} target="_blank" rel="noopener noreferrer">
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.twitterUrl}
          </h4>
        </a>
      </div>
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaTiktok style={{ marginLeft: "-10px" }} />
        </i>
        <a href={formdata.tiktokUrl} target="_blank" rel="noopener noreferrer">
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.tiktokUrl}
          </h4>
        </a>
      </div>
      <div className="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
        <i className="fab fa-facebook-f">
          <FaYoutube style={{ marginLeft: "-10px" }} />
        </i>
        <a href={formdata.youtubeUrl} target="_blank" rel="noopener noreferrer">
          <h4
            className="fw-700 text-grey-900 font-xssss mt-2"
            style={{ marginLeft: "5px" }}
          >
            {formdata.youtubeUrl}
          </h4>
        </a>
      </div>
    </div>
  );
};

export default Events;
