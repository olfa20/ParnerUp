import React, { Component, Fragment, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";

const Settings = () => {
  const history = useHistory();

  const auth = useContext(AuthContext);

  return (
    <Fragment>
      <Header />

      <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-lg-5 p-4 w-100 border-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="mb-4 font-xxl fw-700 mont-font mb-lg-5 mb-4 font-md-xs">
                        Settings
                      </h4>
                      <div className="nav-caption fw-600 font-xssss text-grey-500 mb-2">
                        Genaral
                      </div>
                      <ul className="list-inline mb-4">
                        <li className="list-inline-item d-block border-bottom me-0">
                          <Link
                            to="/accountinformation"
                            className="pt-2 pb-2 d-flex align-items-center"
                          >
                            <i className="btn-round-md bg-primary-gradiant text-white feather-home font-md me-3"></i>{" "}
                            <h4 className="fw-600 font-xsss mb-0 mt-0">
                              Acount Information
                            </h4>
                            <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                          </Link>
                        </li>

                        {auth.userType === "appowner" && (
                          <li className="list-inline-item d-block me-0">
                            <Link
                              to="/socialaccount"
                              className="pt-2 pb-2 d-flex align-items-center"
                            >
                              <i className="btn-round-md bg-red-gradiant text-white feather-twitter font-md me-3"></i>{" "}
                              <h4 className="fw-600 font-xsss mb-0 mt-0">
                                Social Acount
                              </h4>
                              <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                            </Link>
                          </li>
                        )}

                        {auth.userType === "influencer" && (
                          <li className="list-inline-item d-block me-0">
                            <Link
                              to="/socialaccount"
                              className="pt-2 pb-2 d-flex align-items-center"
                            >
                              <i className="btn-round-md bg-red-gradiant text-white feather-twitter font-md me-3"></i>{" "}
                              <h4 className="fw-600 font-xsss mb-0 mt-0">
                                Social Acount
                              </h4>
                              <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                            </Link>
                          </li>
                        )}
                      </ul>

                      <div className="nav-caption fw-600 font-xsss text-grey-500 mb-2">
                        Acount
                      </div>
                      <ul className="list-inline mb-4">
                        <li className="list-inline-item d-block  me-0">
                          <Link
                            to="/password"
                            className="pt-2 pb-2 d-flex align-items-center"
                          >
                            <i className="btn-round-md bg-blue-gradiant text-white feather-inbox font-md me-3"></i>{" "}
                            <h4 className="fw-600 font-xsss mb-0 mt-0">
                              Password
                            </h4>
                            <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                          </Link>
                        </li>
                      </ul>

                      <div className="nav-caption fw-600 font-xsss text-grey-500 mb-2">
                        Other
                      </div>
                      <ul className="list-inline">
                        {auth.userType === "influencer" && (
                          <li className="list-inline-item d-block border-bottom me-0">
                            <a
                              href="/problem"
                              className="pt-2 pb-2 d-flex align-items-center"
                            >
                              <i className="btn-round-md bg-primary-gradiant text-white feather-help-circle font-md me-3"></i>{" "}
                              <h4 className="fw-600 font-xsss mb-0 mt-0">
                                Report a problem
                              </h4>
                              <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                            </a>
                          </li>
                        )}
                        {auth.userType === "appowner" && (
                          <li className="list-inline-item d-block border-bottom me-0">
                            <a
                              href="/problem"
                              className="pt-2 pb-2 d-flex align-items-center"
                            >
                              <i className="btn-round-md bg-primary-gradiant text-white feather-help-circle font-md me-3"></i>{" "}
                              <h4 className="fw-600 font-xsss mb-0 mt-0">
                                Report a problem
                              </h4>
                              <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                            </a>
                          </li>
                        )}
                        <li
                          className="list-inline-item d-block me-0"
                          onClick={auth.logout}
                        >
                          <a
                            href="/login"
                            className="pt-2 pb-2 d-flex align-items-center"
                          >
                            <i className="btn-round-md bg-red-gradiant text-white feather-lock font-md me-3"></i>{" "}
                            <h4 className="fw-600 font-xsss mb-0 mt-0">
                              Logout
                            </h4>
                            <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                          </a>
                        </li>
                      </ul>
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
  );
};

export default Settings;
