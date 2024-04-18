import React, { Component, Fragment, useEffect, useState } from "react";
import Pagetitle from "../../components/Pagetitle";
import { AuthContext } from "../../shared/authContext";
import axios from "axios";
import Rightchat from "../../components/Rightchat";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";

import { useContext } from "react";
import Header from "../../components/Header";
import Appfooter from "../../components/Appfooter";
import Popupchat from "../../components/Popupchat";
import Leftnav from "../../components/Leftnav";
import GoogleMapReact from "google-map-react";
import ImageProblem from "../../components/ImageProblem";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Problems = () => {
  const [search, setSearch] = useState("");

  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/problem/getprobelm/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        console.log(result, "here");
        setProblems(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchProblems();
    }
  }, [auth.userId]);

  const handleDelete = (problemId) => {
    setProblems(problems.filter((p) => p._id !== problemId));
    axios
      .delete(`http://localhost:5000/problem/${problemId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 chat-left scroll-bar">
                <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                  <div className="bg-pattern-div"></div>
                  <h2
                    className="display2-md-size fw-700 text-white mb-0 mt-0"
                    style={{ fontSize: "35px" }}
                  >
                    Problems{" "}
                    <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block"></span>
                  </h2>
                </div>
                {problems.map((problem) => (
                  <div
                    key={problem._id}
                    className="card d-block w-100 border-0 mb-3 shadow-xss bg-white rounded-3 pe-4 pt-4 pb-4"
                    style={{ paddingLeft: "120px" }}
                  >
                    <i
                      onClick={() => handleDelete(problem._id)}
                      className="feather-delete font-md text-grey-500 position-absolute right-0 me-3"
                    ></i>
                    {problem.userType === "influencer" && (
                      <h4 className="font-xss fw-700 text-grey-900 mb-3 pe-4">
                        {problem.fname} {problem.lname}{" "}
                        <span className="font-xssss fw-500 text-grey-500 ms-4">
                          ({" "}
                          {new Date(problem.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                          )
                        </span>{" "}
                      </h4>
                    )}
                    {problem.userType === "appowner" && (
                    <h4 className="font-xss fw-700 text-grey-900 mb-3 pe-4">
                      {problem.company} {" "}
                      <span className="font-xssss fw-500 text-grey-500 ms-4">
                        ({" "}
                        {new Date(problem.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        )
                      </span>{" "}
                    </h4>
                    )}
                    <h5 className="font-xssss mb-2 text-grey-900 fw-600">
                      <span className="text-grey-900 font-xssss text-dark">
                        Email :{" "}
                      </span>{" "}
                      {problem.email}
                    </h5>
                    <h5 className="font-xssss mb-2 text-grey-900 fw-600">
                      <span className="text-grey-900 font-xssss text-dark">
                        Message :{" "}
                      </span>
                      {problem.message}
                    </h5>
                    <h5 className="font-xsssstext-grey-900 fw-600 mb-3">
                      <span className="text-grey-900 font-xssss text-dark">
                        Phone :{" "}
                      </span>{" "}
                      {problem.phone}
                    </h5>
                    {problem.userType === "influencer" && (
                      <h6 className="d-inline-block p-2 text-success alert-success fw-600 font-xssss rounded-3 me-2">
                        {problem.userType}
                      </h6>
                    )}
                    {problem.userType === "appowner" && (
                      <h6 className="d-inline-block p-2 font-xssss rounded-3 me-2 alert alert-danger text-danger fw-600">
                        {problem.userType}
                      </h6>
                    )}
                    <ImageProblem imageUrl={problem?.media} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Problems;
