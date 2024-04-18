import React, { Component, Fragment, useEffect, useState } from "react";

import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";
import { AuthContext } from "../../shared/authContext";
import Header from "../../components/Header";
import Appfooter from "../../components/Appfooter";
import Rightchat from "../../components/Rightchat";
import { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DisplayMessage from "../../components/DisplayMessage";

const Notification = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/notification/${auth.userId}`,
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
      fetchNotifications();
    }
  }, [auth.userId]);

  const handleAccept = async (offerId, appOwnerId, influencerId) => {
    const requestBody = {
      offerId: offerId,
      appOwnerId: appOwnerId,
      influencerId: influencerId,
      status: true,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/notification/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setShowModal(true);
        setModalMessage("The candidate has been chosen");
      } else {
        setShowModal(true);
        setModalMessage(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefuse = async (offerId, appOwnerId, influencerId) => {
    console.log(offerId, "here");
    const requestBody = {
      offerId: offerId,
      appOwnerId: appOwnerId,
      influencerId: influencerId,
      status: false,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/notification/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setShowModal(true);
        setModalMessage("The candidate has been refused");
      } else {
        setShowModal(true);
        setModalMessage(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/notification/countapp/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        console.log(result, "ger");
        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchCounts();
    }
  }, [auth.userId]);

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
                    {error ? (
                      <span style={{ color: "red" }}>{message}</span>
                    ) : (
                      <span>Notifications</span>
                    )}
                    <span className="circle-count bg-warning text-white font-xsssss rounded-3 ms-2 ls-3 fw-600 p-2  mt-0">
                      {count}
                    </span>
                  </h2>

                  <ul className="notification-box">
                    {notifications.map((notification) => (
                      <li key={notification._id}>
                        <a
                          // href={`/profile/${notification.sender}`}
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
                          <Link to={`/profile/${notification.sender}`}>
                            <h6
                              className="font-xssss text-grey-900 text-grey-900 mb-0 mt-0 fw-500 lh-20"
                              style={{ marginLeft: "-60px" }}
                            >
                              <strong></strong> {notification.message}
                              <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0 0l-auto">
                                {" "}
                                {new Date(
                                  notification.date
                                ).toLocaleTimeString()}
                              </span>{" "}
                              <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0 0l-auto">
                                {" "}
                                {new Date(
                                  notification.date
                                ).toLocaleDateString()}
                              </span>{" "}
                            </h6>
                          </Link>
                          <button
                            onClick={() =>
                              handleAccept(
                                notification.job,
                                notification.receiver,
                                notification.sender
                              )
                            }
                            className="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl ms-auto"
                            style={{ border: "none" }}
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() =>
                              handleRefuse(
                                notification.job,
                                notification.receiver,
                                notification.sender
                              )
                            }
                            className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
                            style={{ border: "none" }}
                          >
                            Refuser
                          </button>
                          <DisplayMessage
                            isOpen={showModal}
                            message={modalMessage}
                            onClose={handleCloseModal}
                          />

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

export default Notification;
