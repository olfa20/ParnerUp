import React, { Component, Fragment, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";

import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import { useHistory } from "react-router-dom";

const AddAdmin = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("admin");
  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();

  const [formdata, setFormdata] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    userType: "",
    phone: "",
    city: "",
    country: "",
    location: "",
  });

  const history = useHistory();
  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        console.log(formdata.email);
        const response = await fetch("http://localhost:5000/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fname: formdata.fname,
            lname: formdata.lname,
            email: formdata.email,
            password: formdata.password,
            userType: userType,
            phone: formdata.phone,
            country: formdata.country,
            city: formdata.city,
            location: formdata.location,
          }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
          setError(true);
          setMessage(responseData.message);
          throw new Error(responseData.message);
        }
        setSuccess(true);
        history.push("/admin");
      } catch (error) {
        setError(error.message);
      }
    }
  };
  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <Fragment>
        <Header />

      

        <div className="main-content right-chat-active bg-white">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row">
                <div className="col-xl-12 cart-wrapper mb-4">
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                        <div className="bg-pattern-div"></div>
                        <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                          Admin{" "}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12"></div>

                    <div class="col-xl-6 col-lg-6">
                      <div class="page-title">
                        {error ? (
                          <span style={{ color: "red" }}>{message}</span>
                        ) : (
                          <h4 class="mont-font fw-600 font-md mb-lg-5 mb-4">
                            Create Admin
                          </h4>
                        )}

                        <form action="#">
                          <div class="row">
                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  name="fname"
                                  class="form-control"
                                  value={formdata.fname}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  name="lname"
                                  class="form-control"
                                  value={formdata.lname}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Email
                                </label>
                                <input
                                  type="text"
                                  name="email"
                                  class="form-control"
                                  value={formdata.email}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Password
                                </label>
                                <input
                                  type="password"
                                  name="password"
                                  class="form-control"
                                  value={formdata.password}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Country
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  class="form-control"
                                  value={formdata.country}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  name="location"
                                  class="form-control"
                                  value={formdata.location}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Twon / City
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  class="form-control"
                                  value={formdata.city}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  name="phone"
                                  class="form-control"
                                  value={formdata.phone}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </form>

                        <div className="form-group mb-1">
                          <button
                            type="submit"
                            className="form-control text-center style2-input text-white fw-600 bg-current border-0 p-0 "
                          >
                            Register
                          </button>
                        </div>
                        {success && (
                          <div className="alert alert-success" role="alert">
                            An email has been sent to your account. Please
                            verify your email.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Popupchat />
        <Appfooter />
      </Fragment>
    </form>
  );
};

export default AddAdmin;
