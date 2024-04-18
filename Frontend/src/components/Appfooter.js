import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";

const Appfooter = () => {
  const [formData, setFormData] = useState({
    profileImage: "",
  });
  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (auth.userType === "influencer") {
          url = `http://localhost:5000/influencer/${auth.userId}`;
        } else if (auth.userType === "appowner") {
          url = `http://localhost:5000/appowner/${auth.userId}`;
        } else if (auth.userType === "superadmin") {
          url = `http://localhost:5000/${auth.userId}`;
        } else if (auth.userType === "admin") {
          url = `http://localhost:5000/${auth.userId}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        console.log(result);

        setFormData(result.user);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth]);
  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      <Link to="/home" className="nav-content-bttn nav-center">
        <i className="feather-home"></i>
      </Link>
      {/* <Link to="/defaultvideo" className="nav-content-bttn"><i className="feather-package"></i></Link>
                <Link to="/defaultlive" className="nav-content-bttn" data-tab="chats"><i className="feather-layout"></i></Link>            */}
      <Link to="/userpage" className="nav-content-bttn">
        <i className="feather-layers"></i>
      </Link>
      <Link to="/defaultsettings" className="nav-content-bttn">
        <img
          src={
            formData.profileImage
              ? "http://localhost:5000/" + formData.profileImage
              : "https://via.placeholder.com/300x300.png"
          }
          alt="user"
          className="w30 shadow-xss"
        />
      </Link>
    </div>
  );
};

export default Appfooter;
