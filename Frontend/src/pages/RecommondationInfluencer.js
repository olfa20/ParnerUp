import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import Pagetitlegroup from "../components/Admin/Pagetitlegroup";
import { useContext } from "react";

import { AuthContext } from "../shared/authContext";
import { Link } from "react-router-dom";

const Recommendation = () => {
  const [search, setSearch] = useState("");
  const [influencers, setInfluencers] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recommondation/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();

        setInfluencers(result.recommendations);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                  <div className="bg-pattern-div"></div>
                  <h2
                    className=" fw-700 text-white mb-0 mt-0"
                    style={{ fontSize: "30px" }}
                  >
                    Recommendation{" "}
                  </h2>
                </div>

                <div className="row ps-2 pe-1">
                  {influencers &&
                    influencers.map((value, index) => (
                      <div key={index} className="col-md-4 col-sm-6 pe-2 ps-2">
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                          <div
                            className="card-body d-block w-100 p-4 text-center"
                            style={{ height: "350px" }}
                          >
                            <figure className="avatar ms-auto me-auto mb-0 position-relative w90 z-index-1">
                              <img
                                src={
                                  value.profileImage
                                    ? "http://localhost:5000/" +
                                      value.profileImage
                                    : "https://via.placeholder.com/300x300.png"
                                }
                                alt="avater"
                                className="float-right p-1 bg-white rounded-circle w-100"
                              />
                            </figure>
                            <div className="clearfix"></div>
                            <h4 className="fw-700 font-xss mt-3 mb-0">
                              {value.fname} {value.lname}
                            </h4>
                            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                              {value.email}
                            </p>
                            <ul className="d-flex align-items-center justify-content-center mt-1">
                              <li className="m-2">
                                <h4 className="fw-700 font-sm">
                                  {value.numberOfCollaborations}{" "}
                                  <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">
                                    Collaborations
                                  </span>
                                </h4>
                              </li>
                            </ul>
                            <Link to={`/profile/${value._id}`}>
                              <a className="mt-4 p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white">
                                Profile
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
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

export default Recommendation;
