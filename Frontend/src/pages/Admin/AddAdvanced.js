import React, { Component, Fragment, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";

import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/authContext";
import { useContext } from "react";

const AddAdvanced = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);

  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();
  const [userType, setUserType] = useState("");

  const [formdata, setFormdata] = useState({
    title: "",
    userType: "",
    description: "",
  });

  const history = useHistory();

  const handleInfluencer = (event) => {
    setUserType("Influencer");
  };
  const handleAppowner = (event) => {
    setUserType("Appowner");
  };

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        const response = await fetch("http://localhost:5000/advanced", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formdata.title,
            description: formdata.description,
            userType: userType,
          }),
        });
        const responseData = await response.json();

        if (!response.ok) {
          setError(true);
          setMessage(responseData.message);
          throw new Error(responseData.message);
        }

        history.push("alladvanced");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.currentTarget.files && event.currentTarget.files.length === 1) {
      pickedFile = event.currentTarget.files[0];
      setFormdata({
        ...formdata,
        [event.currentTarget.name]: pickedFile,
      });
      setOldImg(URL.createObjectURL(event.currentTarget.files[0]));
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Fragment>
        <Header />

     

        <div className="main-content right-chat-active bg-white theme-dark-bg">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row">
                <div className="col-xl-12 cart-wrapper mb-4">
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                        <div className="bg-pattern-div"></div>
                        <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                          Advanced{" "}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12"></div>

                    <div class="col-xl-6 col-lg-6" style={{marginLeft:"280px"}}>
                      <div class="page-title">
                        <form action="#">
                          <div class="row">
                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  title
                                </label>
                                <input
                                  type="text"
                                  name="title"
                                  class="form-control"
                                  value={formdata.title}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Description
                                </label>
                                <textarea
                                  type="text"
                                  name="description"
                                  class="form-control"
                                  value={formdata.description}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div>
                              <div style={{marginLeft:"100px"}}> 
                                <label htmlFor="influencer">
                                  <input
                                    type="radio"
                                    id="Influencer"
                                    name="userType"
                                    value={userType}
                                    checked={userType === "Influencer"}
                                    onChange={handleInfluencer}
                                  />
                                  Influencer
                                </label>

                                <label
                                  htmlFor="appowner"
                                  style={{ marginLeft: "20px" }}
                                >
                                  <input
                                    type="radio"
                                    id="Appowner"
                                    name="role"
                                    value={userType}
                                    checked={userType === "Appowner"}
                                    onChange={handleAppowner}
                                  />
                                  AppOwner
                                </label>
                              </div>
                            </div>
                          </div>
                        </form>

                        <div className="form-group mb-1" style={{marginTop:"20px"}}>
                          <button
                            type="submit"
                            className="form-control text-center style2-input text-white fw-600 bg-current border-0 p-0 "
                          >
                            Register
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

        <Popupchat />
        <Appfooter />
      </Fragment>
    </form>
  );
};

export default AddAdvanced;
