import React, { Component, Fragment, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";

import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/authContext";
import { useContext } from "react";

const AddAbonnement = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);

  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();

  const [formdata, setFormdata] = useState({
    title: "",
    services: "",
    price: "",
    duration: "",
    paymentMethod: "",
    media: null,
    created_by: auth.userId,
    description: "",
  });

  const history = useHistory();

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formdata.title) {
      setError(true);
      setMessage("Title is required");
    } else if (!formdata.services) {
      setError(true);
      setMessage("services is required");
    } else if (!formdata.price) {
      setError(true);
      setMessage("price is required");
    } else if (!formdata.duration) {
      setError(true);
      setMessage("duration is required");
    } else if (!formdata.paymentMethod) {
      setError(true);
      setMessage("paymentMethod is required");
    } else {
      try {
        const formData = new FormData();
        formData.append("title", formdata.title);
        formData.append("duration", formdata.duration);
        formData.append("paymentMethod", formdata.paymentMethod);
        formData.append("price", formdata.price);
        formData.append("services", formdata.services);
        formData.append("created_by", formdata.created_by);
        formData.append("media", formdata.media);
        formData.append("description", formdata.description);

        console.log(formdata);
        const response = await fetch(`http://localhost:5000/abonnement`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        history.push("/abonnement");
      } catch (err) {
        setError(true);
        setMessage(err.message);
        console.log(err.message);
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
                          Abonnement{" "}
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
                            Create Subscription
                          </h4>
                        )}
                        <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                          <img
                            src={oldImg}
                            alt="avater"
                            className="shadow-sm rounded-3 w-100"
                          />
                        </figure>

                        <form action="#">
                          <div class="row">
                            <div class="col-lg-6 mb-3">
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

                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Price
                                </label>
                                <input
                                  type="integer"
                                  name="price"
                                  class="form-control"
                                  value={formdata.price}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  name="duration"
                                  class="form-control"
                                  value={formdata.duration}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  PaymentMethod
                                </label>
                                <input
                                  type="text"
                                  name="paymentMethod"
                                  class="form-control"
                                  value={formdata.paymentMethod}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Services
                                </label>
                                <textarea
                                  type="text"
                                  name="services"
                                  class="form-control"
                                  value={formdata.services}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
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

                            <div className="form-group mb-0 w-100">
                              <input
                                type="file"
                                name="media"
                                id="file"
                                className="input-file"
                                onChange={pickedHandler}
                              />
                              <label
                                htmlFor="file"
                                className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed"
                              >
                                <i className="ti-cloud-down large-icon me-3 d-block"></i>
                                <span className="js-fileName">
                                  Drag and drop or click to replace
                                </span>
                              </label>
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
                            An subscription is created successfully.
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

export default AddAbonnement;
