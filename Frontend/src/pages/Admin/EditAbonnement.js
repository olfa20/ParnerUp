import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";

import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import { useHistory, useParams } from "react-router-dom";

const Checkout = () => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();
  let { id } = useParams();
  console.log(id, "here");

  const [formdata, setFormdata] = useState({
    title: "",
    services: "",
    price: "",
    duration: "",
    paymentMethod: "",
    media: "",
    created_by: "",
    description: "",
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`http://localhost:5000/abonnement/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();

        setFormdata(result.abonnement);
        setOldImg(
          result.abonnement.media
            ? "http://localhost:5000/" + result.abonnement.media
            : "https://via.placeholder.com/300x300.png"
        );
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchSubscription();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formdata.title) {
      setError(true);
      setMessage("Title is required");
    } else if (!formdata.duration) {
      setError(true);
      setMessage("Duration is required");
    } else if (!formdata.price) {
      setError(true);
      setMessage("Price is required");
    } else if (!formdata.services) {
      setError(true);
      setMessage("Services is required");
    } else if (!formdata.paymentMethod) {
      setError(true);
      setMessage("paymentMethod is required");
    } else {
      let formDataUp = new FormData();

      formDataUp.append("title", formdata.title);
      formDataUp.append("services", formdata.services);
      formDataUp.append("paymentMethod", formdata.paymentMethod);
      formDataUp.append("duration", formdata.duration);
      formDataUp.append("price", formdata.price);
      formDataUp.append("media", formdata.media);
      formDataUp.append("description", formdata.description);

      try {
        const response = await fetch(`http://localhost:5000/abonnement/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer ",
          },
          body: formDataUp,
        });
        const result = await response.json();
        if (!response.ok) {
          setError(true);
          setMessage(result.message);
          throw new Error(result.message);
        }

        history.push("/abonnement");
      } catch (error) {
        console.log(error);
        setError(true);
        setMessage(error);
      }
    }
  };

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
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
    <form onSubmit={handleSubmit}>
      <Fragment>
        <Header />
       


        <div className="main-content right-chat-active bg-white">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row">
                <div className="col-xl-12 cart-wrapper mb-4" >
                  <div className="row">
                    <div className="col-lg-12 mb-3" >
                      <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                        <div className="bg-pattern-div"></div>
                        {error ? (
                          <span style={{ color: "red" }}>{message}</span>
                        ) : (
                          <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                            Subscription{" "}
                          </h2>
                        )}
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12"></div>

                    <div class="col-xl-6 col-lg-6" style={{marginLeft:"280px"}}>
                      <div class="page-title">
                        <h4 class="mont-font fw-600 font-md mb-lg-5 mb-4"  style={{marginLeft:"100px"}}>
                          Edit Subscription
                        </h4>
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
                                  Title
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
                                  Payment Method
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
                            <div class="col-lg-6 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  Price
                                </label>
                                <input
                                  type="text"
                                  name="price"
                                  class="form-control"
                                  value={formdata.price}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

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
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  description
                                </label>
                                <textarea
                                  type="text"
                                  name="description"
                                  class="form-control"
                                  value={formdata.description}
                                  onChange={handleChange}
                                />
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

export default Checkout;
