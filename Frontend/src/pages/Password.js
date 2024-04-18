import React, { Component, Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { useHistory } from "react-router-dom";
const Password = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);

  const [formdata, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/influencer/${auth.userId}`,
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

  const handleChange = (event) => {
    setFormData({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/influencer/editpassword/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );
      const result = await response.json();
      if (response.ok) {
        history.push('/defaultanalytics');
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <form onSubmit={submitHandler}>
      <Fragment>
        <div className="main-wrapper">
          <Header />

          <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
            <div className="middle-sidebar-bottom">
              <div className="middle-sidebar-left">
                <div className="middle-wrap">
                  <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                    <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                      <Link
                        to="/defaultsettings"
                        className="d-inline-block mt-2"
                      >
                        <i className="ti-arrow-left font-sm text-white"></i>
                      </Link>
                      <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                        Change Password
                      </h4>
                    </div>
                    <div className="card-body p-lg-5 p-4 w-100 border-0">
                      <form action="#">
                        <div className="row">
                          <div className="col-lg-12 mb-3">
                            <div className="form-gorup">
                              <label className="mont-font fw-600 font-xssss">
                                Current Password
                              </label>
                              <input
                                type="password"
                                name="currentPassword"
                                className="form-control"
                                value={formdata.currentPassword}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 mb-3">
                            <div className="form-gorup">
                              <label className="mont-font fw-600 font-xssss">
                                Change Password
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                className="form-control"
                                value={formdata.newPassword}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* <div className="row">
                          <div className="col-lg-12 mb-3">
                            <div className="form-gorup">
                              <label className="mont-font fw-600 font-xssss">
                                Confirm Change Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formdata.confirmPassword}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div> */}
                      </form>
                      <div className="row">
                        <div className="col-lg-12 mb-0">
                          <button
                            type="submit"
                            className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </form>
  );
};

export default Password;
