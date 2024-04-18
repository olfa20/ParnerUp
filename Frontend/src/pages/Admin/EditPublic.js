import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";
import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";
import { useHistory } from "react-router-dom";

const EditPublic = () => {
    const history = useHistory()
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);

  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();

  const [formdata, setFormdata] = useState({
    name: "",
  });
  let {id} = useParams()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();

        setFormdata(result.public);
      
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchSubscription();
    }
  }, [id]);
  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formdata.name) {
      setError(true);
      setMessage("Name is required");
    } else {
      try {
        const response = await fetch(
            `http://localhost:5000/public/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
            body: JSON.stringify({
              name: formdata.name,
            }),
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        history.push("/public");
      } catch (err) {
        console.log(err);
      }
    }
  };


  return (
    <form onSubmit={submitHandler}>
      <Header />

      <div className="middle-sidebar-bottom">
        <div className="middle-sidebar-left">
          <div className="middle-wrap">
            <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
              <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                <Link to="/defaultsettings" className="d-inline-block mt-2">
                  <i className="ti-arrow-left font-sm text-white"></i>
                </Link>
              </div>
              <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                <div className="row justify-content-center"></div>

                <form>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <div className="form-group">
                        <label className="mont-font fw-600 font-xsss mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formdata.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </form>
                <div className="col-lg-12">
                  <button className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPublic;
