import React, { Component, Fragment, useEffect, useState } from "react";

import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";

const NotificationInf = () => {
  const [count, setCount] = useState(0);
  const [Error, setError] = useState();
  const [notifications, setNotifications] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/notification/influencer/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setNotifications(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchOffers();
    }
  }, [auth.userId]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/notification/count/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchCounts();
    }
  }, [auth.userId]);

  const handleDelete = (notificationId) => {
    setNotifications(notifications.filter((n) => n._id !== notificationId));
    axios
      .delete(`http://localhost:5000/notification/${notificationId}`)
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

      <div className="main-content theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row">
              <div className="col-lg-12">
                <div className="chat-wrapper p-3 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                  <h2 className="fw-700 mb-4 mt-2 font-md text-grey-900 d-flex align-items-center">
                    Notification
                    <span className="circle-count bg-warning text-white font-xsssss rounded-3 ms-2 ls-3 fw-600 p-2  mt-0">
                      {count}
                    </span>
                    {/* <a
                      href="/defaultnotification"
                      className="ms-auto btn-round-sm bg-greylight rounded-3"
                    >
                      <i className="feather-hard-drive font-xss text-grey-500"></i>
                    </a> */}
                    {/* <a
                      href="/defaultnotification"
                      className="ms-2 btn-round-sm bg-greylight rounded-3"
                    >
                      <i className="feather-alert-circle font-xss text-grey-500"></i>
                    </a> */}
                    {/* <a
                      href="/defaultnotification"
                      className="ms-2 btn-round-sm bg-greylight rounded-3"
                    >
                      <i className="feather-trash-2 font-xss text-grey-500"></i>
                    </a> */}
                  </h2>

                  <ul className="notification-box">
                    {notifications.map((notification) => (
                      <li key={notification._id}>
                        <a
                          className={`d-flex align-items-center p-3 rounded-3`}
                        >
                          <img
                            src={
                              notification.image
                                ? "http://localhost:5000/" + notification.image
                                : "https://via.placeholder.com/300x300.png"
                            }
                            alt="user"
                            className="w45 me-3"
                          />
                          <i
                            className={`text-white me-2 font-xssss notification-react `}
                          ></i>

                          <h6 className="font-xssss text-grey-900 text-grey-900 mb-0 mt-0 fw-500 lh-20">
                            <strong></strong> {notification.message}
                            {/* <RiDeleteBin6Line
                              onClick={() => handleDelete(notification._id)}
                            /> */}
                            <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0 0l-auto">
                              {" "}
                              {new Date(
                                notification.createdAt
                              ).toLocaleTimeString()}
                            </span>{" "}
                            <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0 0l-auto">
                              {" "}
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                            </span>{" "}
                          </h6>

                          {/* <i className="ti-more-alt text-grey-500 font-xs ms-auto"></i> */}
                        </a>
                      </li>
                    ))}
                  </ul>
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

export default NotificationInf;
