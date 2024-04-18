import React, { Component, Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";

import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { useAuth } from "../shared/authHook";

const Account = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);
  const [contents, setContent] = useState([]);
  const [publics, setPublics] = useState([]);
  const [audiencAges, setAudienceAges] = useState([]);
  const [formdata, setFormData] = useState({
    email: "",
    fname: "",
    lname: "",
    category: "",
    profileImage: "",
    city: "",
    country: "",
    phone: "",
    postcode: "",
    description: "",
    content: "",
    public: "",
    audienceAge: "",
  });
  const [oldImg, setOldImg] = useState();
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/content/contents`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setContent(result.contents);
      } catch (err) {
        setError(err);
      }
    };
    fetchContent();
  }, [auth.token]);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/publics`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setPublics(result.publics);
      } catch (err) {
        setError(err);
      }
    };
    fetchPublic();
  }, [auth.token]);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/audience/audiences`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        setAudienceAges(result.audiences);
      } catch (err) {
        setError(err);
      }
    };
    fetchAudience();
  }, [auth.token]);

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
        console.log(result);
        setFormData(result.user);
        setOldImg(
          result.user.profileImage
            ? "http://localhost:5000/" + result.user.profileImage
            : "https://via.placeholder.com/300x300.png"
        );
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formdata.email) {
      setError(true);
      setMessage("Email is required");
    } else if (!formdata.fname) {
      setError(true);
      setMessage("First Name is required");
    } else if (!formdata.lname) {
      setError(true);
      setMessage("Last Name is required");
    } else if (!formdata.city) {
      setError(true);
      setMessage("City is required");
    } else if (!formdata.phone) {
      setError(true);
      setMessage("Phone is required");
    } else {
      let formDataUp = new FormData();

      formDataUp.append("fname", formdata.fname);
      formDataUp.append("email", formdata.email);

      formDataUp.append("lname", formdata.lname);
      formDataUp.append("city", formdata.city);
      formDataUp.append("phone", formdata.phone);
      formDataUp.append("profileImage", formdata.profileImage);
      formDataUp.append("description", formdata.description);
      formDataUp.append("postcode", formdata.postcode);
      formDataUp.append("content", formdata.content);
      formDataUp.append("public", formdata.public);
      formDataUp.append("audienceAge", formdata.audienceAge);
      formDataUp.append("country", formdata.country);

      try {
        const response = await fetch(
          `http://localhost:5000/influencer/editprofil/${auth.userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
            body: formDataUp,
          }
        );
        const result = await response.json();

        if (!response.ok) {
          setError(true);
          setMessage(result.message);
          throw new Error(result.message);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setMessage(error);
      }
      history.push("/userpage");
    }
  };

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.currentTarget.files && event.currentTarget.files.length === 1) {
      pickedFile = event.currentTarget.files[0];
      setFormData({
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

        <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left">
              <div className="middle-wrap">
                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                  <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                    <Link to="/defaultsettings" className="d-inline-block mt-2">
                      <i className="ti-arrow-left font-sm text-white"></i>
                    </Link>
                    {error ? (
                      <span style={{ color: "red" }}>{message}</span>
                    ) : (
                      <span> Account Details</span>
                    )}
                  </div>
                  <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                    <div className="row justify-content-center">
                      <div className="col-lg-4 text-center">
                        <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                          <img
                            src={oldImg}
                            alt="avater"
                            className="shadow-sm rounded-3 w-100"
                          />
                        </figure>
                        <h2 className="fw-700 font-sm text-grey-900 mt-3">
                          {formdata.lname} {formdata.fname}
                        </h2>
                        <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4"></h4>
                      </div>
                    </div>

                    <form>
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="fname"
                              value={formdata.fname}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="lname"
                              value={formdata.lname}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Email
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formdata.email}
                              onChange={handleChange}
                              name="email"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Phone
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              value={formdata.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="country"
                              value={formdata.country}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Content
                          </label>
                          <select
                            className="form-control"
                            name="content"
                            required=""
                            value={formdata.content}
                            onChange={handleChange}
                          >
                            <option value={""}>Select Content</option>

                            {contents &&
                              contents.map((cat) => {
                                return (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formdata.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Public
                          </label>
                          <select
                            className="form-control"
                            name="public"
                            required=""
                            value={formdata.public}
                            onChange={handleChange}
                          >
                            <option value={""}>Select public</option>

                            {publics &&
                              publics.map((cat) => {
                                return (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Twon / City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              value={formdata.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Audience-Ages
                          </label>
                          <select
                            className="form-control"
                            name="audienceAge"
                            required=""
                            value={formdata.audienceAge}
                            onChange={handleChange}
                          >
                            <option value={""}>Select audience</option>

                            {audiencAges &&
                              audiencAges.map((cat) => {
                                return (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="col-lg-12 mb-3">
                          <div className="card mt-3 border-0">
                            <div className="card-body d-flex justify-content-between align-items-end p-0">
                              <div className="form-group mb-0 w-100">
                                <input
                                  type="file"
                                  name="profileImage"
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
                        </div>

                        <div className="col-lg-12 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Description
                          </label>
                          <textarea
                            className="form-control mb-0 p-3 h100 bg-greylight lh-16"
                            rows="5"
                            placeholder="Write your message..."
                            name="description"
                            value={formdata.description}
                            onChange={handleChange}
                          ></textarea>
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
        </div>

        {/* <Popupchat /> */}
        <Appfooter />
      </Fragment>
    </form>
  );
};

export default Account;
