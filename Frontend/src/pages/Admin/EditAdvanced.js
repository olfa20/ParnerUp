import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";

import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import { useHistory, useParams } from "react-router-dom";

const EditAdvanced = () => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [oldImg, setOldImg] = useState();
  let { id } = useParams();

  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchAdvanced = async () => {
      try {
        const response = await fetch(`http://localhost:5000/advanced/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setFormdata(result);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchAdvanced();
    }
  }, [id]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formdata.title) {
      setError(true);
      setMessage("title is required");
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/advanced/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " ,
            },
            body: JSON.stringify({
              title:formdata.title,
              description:formdata.description
              ,
            }),
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        history.push("/alladvanced");
      } catch (err) {
        console.log(err);
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
                        {error ? (
                          <span style={{ color: "red" }}>{message}</span>
                        ) : (
                          <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                            Advanced{" "}
                          </h2>
                        )}
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12"></div>

                    <div class="col-xl-6 col-lg-6">
                      <div class="page-title">
                        <h4 class="mont-font fw-600 font-md mb-lg-5 mb-4">
                          Edit Advanced
                        </h4>

                        <form action="#">
                          <div class="row">
                            <div class="col-lg-12 mb-3">
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
                          </div>

                          <div class="row">
                            <div class="col-lg-12 mb-3">
                              <div class="form-gorup">
                                <label class="mont-font fw-600 font-xssss">
                                  description
                                </label>
                                <textarea
                                style={{height:"100px"}}
                                  type="text"
                                  name="description"
                                  class="form-control"
                                  value={formdata.description}
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

export default EditAdvanced;
