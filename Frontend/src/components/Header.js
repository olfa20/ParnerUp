import React, { Component, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Darkbutton from "../components/Darkbutton";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { Accordion } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { mdiNote } from "@mdi/react";

const Header = ({ img }) => {
  dayjs.extend(relativeTime);
  const [count1, setCount1] = useState(0);
  const [notificationApp, setNotificationApp] = useState(0);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [note, setNotes] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { showbutton, setShowButton } = useState(false);
  const history = useHistory();
  const [formdata, setformData] = useState({
    services: "",
  });

  const [formData, setFormData] = useState({
    profileImage: "",
  });

  const auth = useContext(AuthContext);
  const [show, setShow] = useState(true);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchLink = `/search/${searchText}`;
    history.push(searchLink);
  };

  // fetch services

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/influencerapp/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
       

        if (
          result.services &&
          result.services.some((service) => service.includes("Chat Message"))
        ) {
          setShow(true);
          console.log("oui");
        } else {
          setShow(false);
          console.log("no");
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth]);

  // fetch notification
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comment/${auth.userId}`,
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

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comment/countnotification/${auth.userId}`,
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

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isNoti, setIsNoti] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleActive = () => setIsActive(!isActive);
  const toggleisNoti = () => setIsNoti(!isNoti);

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive ? " show" : ""}`;
  const notiClass = `${isNoti ? " show" : ""}`;

  const updatenotification = (notificationId) => {
    axios
      .patch(`http://localhost:5000/comment/update/${notificationId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/note/count/`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        console.log(result);
        setNotes(result.count);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchNote();
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
        setCount1(result.count);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchCounts();
    }
  }, [auth.userId]);

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
        setNotificationApp(result.count);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchCounts();
    }
  }, [auth.userId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5000/influencer/${auth.userId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: "Bearer " + auth.token,
  //           },
  //         }
  //       );
  //       const result = await response.json();
  //       console.log(result);

  //       setFormData(result.user);
  //     } catch (err) {
  //       setError(err);
  //     }
  //   };

  //   if (auth.userId) {
  //     fetchData();
  //   }
  // }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (auth.userType === "influencer") {
          url = `http://localhost:5000/influencer/${auth.userId}`;
        } else if (auth.userType === "appowner") {
          url = `http://localhost:5000/appowner/${auth.userId}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        console.log(result);

        setFormData(result.user);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth]);

  return (
    <div className="nav-header bg-white shadow-xs border-0">
      <div className="nav-top">
        <Link to="/">
          <i className="feather-zap text-success display2-size me-3 ms-0"></i>
          <span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
            PartnerUp{" "}
          </span>{" "}
        </Link>
        <Link to="/messages" className="mob-menu ms-auto me-2 chat-active-btn">
          <i className="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </Link>

        <Link to="/defaultvideo" className="mob-menu me-2">
          <i className="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </Link>
        <span onClick={toggleActive} className="me-2 menu-search-icon mob-menu">
          <i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </span>
        <button
          onClick={toggleOpen}
          className={`nav-menu me-0 ms-2 ${buttonClass}`}
        ></button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        action="#"
        className="float-left header-search ms-3"
      >
        <div className="form-group mb-0 icon-input">
          <i type="submit" className="feather-search font-sm text-grey-400"></i>

          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg"
            value={searchText}
            onChange={handleInputChange}
          />
        </div>
      </form>
      {auth.userType === "influencer" && (
        <NavLink
          activeClassName="active"
          to="/home"
          className="p-2 text-center ms-3 menu-icon center-menu-icon"
        >
          <i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
        </NavLink>
      )}
      {auth.userType === "appowner" && (
        <NavLink
          activeClassName="active"
          to="/home"
          className="p-2 text-center ms-3 menu-icon center-menu-icon"
        >
          <i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
        </NavLink>
      )}

      {/* <NavLink
        activeClassName="active"
        to="/defaultstorie"
        className="p-2 text-center ms-0 menu-icon center-menu-icon"
      >
        <i className="feather-zap font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
      </NavLink> */}
      {auth.userType === "appowner" && (
        <NavLink
          activeClassName="active"
          to="/defaultgroup"
          className="p-2 text-center ms-0 menu-icon center-menu-icon"
        >
          <i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
        </NavLink>
      )}
      {auth.userType === "influencer" && (
        <NavLink
          activeClassName="active"
          to="/defaultnoti"
          className="p-2 text-center ms-0 menu-icon center-menu-icon"
        >
          <i className="feather-shopping-bag font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i>
        </NavLink>
      )}

      <span
        className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`}
        id="dropdownMenu3"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={toggleisNoti}
      >
        <span className="circle-count bg-warning text-white font-xsssss rounded-3 ms-2 ls-3 fw-600 p-2  mt-0">
          {count}
        </span>
        <i className="feather-bell font-xl text-current"></i>
      </span>

      <div
        className={`dropdown-menu p-3 right-0 rounded-xxl border-0 shadow-lg  theme-dark-bg ${notiClass}`}
        style={{ width: "450px" }}
        aria-labelledby="dropdownMenu3"
      >
        <h4 className="fw-700 font-xss mb-4">Notification</h4>
        <div
          className="notification-container"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="card bg-transparent-card w-100 border-0 ps-6 mb-3"
            >
              <Link to={"/userpage"}>
                <h5
                  className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block"
                  style={{ display: "flex" }}
                  onClick={() => updatenotification(notification._id)}
                >
                  {notification.image ? (
                    <img
                      src={"http://localhost:5000/" + notification.image}
                      className="w40 mt--1 rounded"
                      style={{
                        marginRight: "9px",
                        verticalAlign: "top",
                        height: "45px",
                      }}
                    />
                  ) : (
                    <span></span>
                  )}
                  {notification.message}{" "}
                </h5>
              </Link>
              <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
                {dayjs(notification.date).fromNow()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Darkbutton />
      {auth.userType === "influencer" && (
        <Link to="/defaultsettings" className="p-0 ms-3 menu-icon">
          <img
            src={
              formData.profileImage
                ? "http://localhost:5000/" + formData.profileImage
                : "https://via.placeholder.com/300x300.png"
            }
            className="w40 mt--1"
          />
        </Link>
      )}
      {auth.userType === "appowner" && (
        <Link to="/defaultsettings" className="p-0 ms-3 menu-icon">
          <img
            src={
              formData.profileImage
                ? "http://localhost:5000/" + formData.profileImage
                : "https://via.placeholder.com/300x300.png"
            }
            className="w40 mt--1"
          />
        </Link>
      )}

      <nav className={`navigation scroll-bar ${navClass}`}>
        <div className="container ps-0 pe-0">
          <div className="nav-content">
            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
              <div className="nav-caption fw-600 font-xssss text-grey-500">
                {auth.userType === "admin" && (
                  <span style={{ fontSize: "20px" }}> Dashboard </span>
                )}
                {auth.userType === "superadmin" && (
                  <span style={{ fontSize: "20px" }}> Dashboard </span>
                )}
              </div>
              {auth.userType === "influencer" && (
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link to="/" className="nav-content-bttn open-font">
                      <i className="feather-tv btn-round-md bg-blue-gradiant me-3"></i>
                      <span>Newsfeed</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/note" className="nav-content-bttn open-font">
                      <div className="note-icon btn-round-md bg-blue-gradiant me-3">
                        📝
                      </div>
                      <span>Notes</span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/userpage" className="nav-content-bttn open-font">
                      <i className="feather-user btn-round-md bg-blue-gradiant me-3"></i>
                      <span>Profile </span>
                    </Link>
                  </li>
                </ul>
              )}

              {auth.userType === "appowner" && (
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link to="/" className="nav-content-bttn open-font">
                      <i className="feather-tv btn-round-md bg-blue-gradiant me-3"></i>
                      <span>Newsfeed</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={`/defaultevent/${auth.userId}`}
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-briefcase btn-round-md bg-blue-gradiant me-3"></i>
                      <span>Offers </span>
                    </Link>
                  </li>

                  <li>
                    <Link to="/userpage" className="nav-content-bttn open-font">
                      <i className="feather-user btn-round-md bg-blue-gradiant me-3"></i>
                      <span> Profile </span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <ul className="mb-1 top-content">
              {auth.userType === "admin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header>Profile Management</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <li>
                            <Link to={"/defaultsettings"}>Settings </Link>
                          </li>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>
            <ul className="mb-1 top-content">
              {auth.userType === "admin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header>influencer Management</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/cart"}>ALL Influencer</Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>
            <ul className="mb-1 top-content">
              {auth.userType === "admin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "-5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header> Appowner Management </Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/appowner"}>ALL Appowner</Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>

            <ul className="mb-1 top-content">
              {auth.userType === "superadmin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header>Profile Management</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <li>
                            <Link to={"/defaultsettings"}>Settings </Link>
                          </li>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>
            <ul className="mb-1 top-content">
              {auth.userType === "superadmin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header>influencer Management</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/cart"}>ALL Influencer</Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>
            <ul className="mb-1 top-content">
              {auth.userType === "superadmin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header> Appowner Management </Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/appowner"}>ALL Appowner</Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>

            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Admin Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/admin"}>ALL Admin</Link>
                      </li>
                      <li></li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>subscription Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/abonnement"}>ALL Subscribtion</Link>
                      </li>
                      <li>
                        <Link to={"/addabonnement"}>Add Subscribtion</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Category Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/abonnement"}>ALL Category</Link>
                      </li>
                      {/* <li>
                        <Link to={"/addabonnement"}>Add Category</Link>
                      </li> */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Content Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/content"}>ALL Content</Link>
                      </li>
                      <li>
                        <Link to={"/addcontent"}>Add Content</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Public Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/public"}>ALL Public</Link>
                      </li>
                      <li>
                        <Link to={"/addPublic"}>Add Public</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Audience Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/audience"}>ALL Audience </Link>
                      </li>
                      <li>
                        <Link to={"/addaudience"}>Add Audience </Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "admin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    Categories Note Management
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/categoriesnote"}>ALL Categories</Link>
                      </li>
                      <li>
                        <Link to={"/addcategory"}>Add Categories</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Content Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/content"}>ALL Content</Link>
                      </li>
                      <li>
                        <Link to={"/addcontent"}>Add Content</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Category Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/category"}>ALL Category</Link>
                      </li>
                      <li>
                        <Link to={"/add"}>Add Category</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Public Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/public"}>ALL Public</Link>
                      </li>
                      <li>
                        <Link to={"/addPublic"}>Add Public</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Audience Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/audience"}>ALL Audience </Link>
                      </li>
                      <li>
                        <Link to={"/addaudience"}>Add Audience </Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Admin Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/admin"}>ALL Admin</Link>
                      </li>
                      <li>
                        <Link to={"/addadmin"}>Add Admin</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>subscription Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/abonnement"}>ALL Subscribtion</Link>
                      </li>
                      <li>
                        <Link to={"/addabonnement"}>Add Subscribtion</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>
                    Categories Note Management
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/categoriesnote"}>ALL Categories</Link>
                      </li>
                      <li>
                        <Link to={"/addcategory"}>Add Categories</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Advanced Management</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/alladvanced"}>ALL Advanced</Link>
                      </li>
                      <li>
                        <Link to={"/addadvanced"}>Add Advanced</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            {auth.userType === "superadmin" && (
              <Accordion
                className="accordion-filter accordion-inner"
                defaultActiveKey="0"
                style={{ marginBottom: "5px" }}
              >
                <Accordion.Item>
                  <Accordion.Header>Analytics</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>
                        <Link to={"/defaultanalytics"}>ALL Analytics</Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            <ul className="mb-1 top-content">
              {auth.userType === "admin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header> Problems </Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/problem"}>ALL problems </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>
            <ul className="mb-1 top-content">
              {auth.userType === "superadmin" && (
                <Accordion
                  className="accordion-filter accordion-inner"
                  defaultActiveKey="0"
                  style={{ marginBottom: "5px" }}
                >
                  <Accordion.Item>
                    <Accordion.Header> Problems </Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <Link to={"/problem"}>ALL problems </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </ul>

            <div
              className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2"
              style={{ marginTop: "-32px" }}
            >
              {auth.userId === "influencer" && (
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span>More </span>Pages
                </div>
              )}
              {auth.userId === "appowner" && (
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span>More </span>Pages
                </div>
              )}

              <ul className="mb-3">
                {auth.userType === "influencer" && (
                  <li>
                    <Link to="/messages" className="nav-content-bttn open-font">
                      <i className="feather-message-circle font-xl text-current me-3"></i>
                      <span>Messages Box</span>
                    </Link>
                  </li>
                )}
                {show && auth.userType === "appowner" && (
                  <li>
                    <Link to="/messages" className="nav-content-bttn open-font">
                      <i className="feather-message-circle font-xl text-current me-3"></i>
                      <span>Messages Box</span>
                      {/* <span className="circle-count bg-warning mt-1">584</span> */}
                    </Link>
                  </li>
                )}
                {auth.userType === "appowner" && (
                  <li>
                    <Link
                      to="/abonnement"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-credit-card font-xl text-current me-3"></i>
                      <span> Subscription </span>
                    </Link>
                  </li>
                )}

                {auth.userType === "influencer" && (
                  <ul>
                    <li>
                      <Link
                        to="/defaultnoti"
                        className="nav-content-bttn open-font"
                      >
                        <i className="font-xl text-current feather-bell me-3"></i>
                        <span>Notifications</span>
                        <span className="circle-count bg-warning mt-1">
                          {count1}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/collaboration"
                        className="nav-content-bttn open-font"
                      >
                        <i className="font-xl text-current feather-users me-3"></i>{" "}
                        <span>Collaborations</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/favorite"
                        className="nav-content-bttn open-font"
                      >
                        <i className="feather-heart font-xl text-current me-3"></i>
                        <span>Favorites</span>
                      </Link>
                    </li>
                  </ul>
                )}
                {auth.userType === "appowner" && (
                  <li>
                    <Link
                      to="/defaultnoti"
                      className="nav-content-bttn open-font"
                    >
                      <i className="font-xl text-current feather-bell me-3"></i>
                      <span>Notifications</span>
                      <span className="circle-count bg-warning mt-1">
                        {notificationApp}
                      </span>
                    </Link>
                  </li>
                )}
                {auth.userType === "appowner" && (
                  <li>
                    <Link to="/condidat" className="nav-content-bttn open-font">
                      <i className="font-xl text-current feather-users me-3"></i>
                      <span>Candidates</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {auth.userType === "appowner" && (
              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span></span> Account
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>

                  {/* <li>
                    <Link
                      to="/defaultmember"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="feather-users font-lg me-3 text-grey-500"></i>
                      <span>Groups</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="/advanced"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="feather-users font-lg me-3 text-grey-500"></i>
                      <span>Advanced</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/review/${auth.userId}`}
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="feather-message-square font-lg me-3 text-grey-500"></i>
                      <span>Reviews</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultsettings"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-settings me-3 text-grey-500"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            {auth.userType === "influencer" && (
              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span></span> Account
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>

                  <li>
                    <Link
                      to="/events"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="feather-calendar font-lg me-3 text-grey-500"></i>
                      <span>Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/advanced"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="feather-box font-lg me-3 text-grey-500"></i>
                      <span>Advanced</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/defaultsettings"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-settings me-3 text-grey-500"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* <div className={`app-header-search ${searchClass}`}>
        <form className="search-form">
          <div className="form-group searchbox mb-0 border-0 p-1">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search..."
            />
            <i className="input-icon">
              <ion-icon
                name="search-outline"
                role="img"
                className="md hydrated"
                aria-label="search outline"
              ></ion-icon>
            </i>
            <span className="ms-1 mt-1 d-inline-block close searchbox-close">
              <i className="ti-close font-xs" onClick={toggleActive}></i>
            </span>
          </div>
        </form>
      </div> */}
    </div>
  );
};

export default Header;
