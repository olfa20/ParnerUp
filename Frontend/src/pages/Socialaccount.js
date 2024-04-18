import React, { Component, Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";

import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";

const Socialaccount = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
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
        // console.log(result);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formDataUp = new FormData();

    formDataUp.append("facebookUrl", formdata.facebookUrl);
    formDataUp.append("instagramUrl", formdata.instagramUrl);
    formDataUp.append("linkedinUrl", formdata.linkedinUrl);
    formDataUp.append("tiktokUrl", formdata.tiktokUrl);
    formDataUp.append("twitterUrl", formdata.twitterUrl);
    formDataUp.append("youtubeUrl", formdata.youtubeUrl);

    try {
      const response = await fetch(
        `http://localhost:5000/social/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(formDataUp)),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(true);
        setMessage(result.message);
        throw new Error(result.message);
      }
      history.go(0);
    } catch (error) {
      console.log(error);
      setError(true);
      setMessage(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
                        Social Network
                      </h4>
                    </div>
                    <div className="card-body p-lg-5 p-4 w-100 border-0">
                      <form action="#">
                        <div className="row">
                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Facebook
                              </label>
                              <input
                                type="text"
                                name="facebookUrl"
                                className="form-control"
                                value={formdata.facebookUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Twitter
                              </label>
                              <input
                                type="text"
                                name="twitterUrl"
                                className="form-control"
                                value={formdata.twitterUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Linkedin
                              </label>
                              <input
                                type="text"
                                name="linkedinUrl"
                                className="form-control"
                                value={formdata.linkedinUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Instagram
                              </label>
                              <input
                                type="text"
                                name="instagramUrl"
                                className="form-control"
                                value={formdata.instagramUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Tiktok
                              </label>
                              <input
                                type="text"
                                name="tiktokUrl"
                                className="form-control"
                                value={formdata.tiktokUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Youtube
                              </label>
                              <input
                                type="text"
                                name="youtubeUrl"
                                className="form-control"
                                value={formdata.youtubeUrl}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="col-lg-12 mb-0 mt-2">
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

        <Popupchat />
        <Appfooter />
      </Fragment>
    </form>
  );
};

export default Socialaccount;
