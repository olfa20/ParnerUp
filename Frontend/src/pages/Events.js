import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import axios from "axios";
import { AuthContext } from "../shared/authContext";
import { useContext } from "react";
import GoogleMapReact from "google-map-react";
import Pagetitlegroup from "../components/Admin/Pagetitlegroup";
import { useHistory } from "react-router-dom";

const Event = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  const fetchEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/event/${auth.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setEvents(result);
    } catch (err) {
      setError(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchEvent();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/event/getbytitle/${search}/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setEvents(result.event);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchEvent();
    } else {
      fetchEvent();
    }
  }, [search, auth.token]);

  const handleDelete = (eventId) => {
    setEvents(events.filter((e) => e._id !== eventId));
    axios
      .delete(`http://localhost:5000/event/${eventId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/event/count/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();

        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  const handleCollaboration = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/collaboration/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();
      console.log(result);

      history.push("/collaboration");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <Pagetitlegroup
              type="text"
              placeholder="Search"
              className="form-control"
              value={search}
              onChange={handleSearch}
              title={` Events`}
            />
            <div className="row">
              {events &&
                events.map((event) => (
                  <div key={event._id} className="col-lg-4 col-md-6 pe-2 ps-2">
                    <div
                      className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden "
                      style={{ height: "350px" }}
                    >
                      <div
                        className="card-image w-100"
                        style={{ height: "500px" }}
                      >
                        <img
                          src={
                            event.job?.media
                              ? "http://localhost:5000/" + event.job?.media
                              : "https://via.placeholder.com/300x300.png"
                          }
                          alt="event"
                          className="w-100 rounded-3"
                        />
                      </div>
                      <div className="card-body d-flex ps-0 pe-0 pb-0">
                        <h2 className="fw-700 lh-3 font-xss">
                          {event.job?.title}
                          <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                            {" "}
                            <i className="ti-location-pin me-1"></i>
                            {event.job?.address}{" "}
                          </span>
                          <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                            <i className="ti-calendar me-1"></i>
                            {event.job?.date}
                          </span>
                          <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                            <i className="ti-money me-1"></i>
                            {event.job?.price}
                          </span>
                        </h2>
                      </div>
                      <div className="card-body p-0">
                        <ul className="memberlist mt-4 mb-2 ms-0 d-inline-block">
                          <li>
                            <a href={`/profileappowner/${event.appowner._id}`}>
                              <img
                                src={
                                  event.appowner?.profileImage
                                    ? "http://localhost:5000/" +
                                      event.appowner?.profileImage
                                    : "https://via.placeholder.com/300x300.png"
                                }
                                alt="user"
                                className="w30 d-inline-block"
                              />
                            </a>
                          </li>
                        </ul>

                        <a
                          onClick={() => handleCollaboration(event._id)}
                          className="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1"
                          style={{
                            backgroundColor: "#28a745",
                            transition: "background-color 0.2s ease-in-out",
                            cursor: "pointer",
                          }}
                        >
                          Finish
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Event;
