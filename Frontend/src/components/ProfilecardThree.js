import React, { useState, useEffect } from "react";
import ImageCouverture from "../images/couverture.jpg";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { Link } from "react-router-dom";

const ProfilecardThree = ({ fname, lname, email, img, id, imgcouverture }) => {
  const [showContactButton, setShowContactButton] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const auth = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const [showb, setShowb] = useState(true);

  const menuClass = `${isOpen ? " show" : ""}`;
  const emojiClass = `${isActive ? " active" : ""}`;

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleActive = () => setIsActive(!isActive);
  useEffect(() => {
    if (!id) {
      setShowContactButton(false);
    }
  }, [id, auth.userId]);

  useEffect(() => {
    if (id) {
      setShow(false);
    }
  }, [id, auth.userId]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const updateCouvertureImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("couvertureImage", file);

      const response = await fetch(
        `http://localhost:5000/influenceur/couvertureImage/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  };

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
        console.log(result.services, "here");
  
        if (
          result.services &&
          result.services.some((service) => service.includes("Chat Message"))
        ) {
          setShowb(true);
          console.log("oui");
        } else {
          setShowb(false);
          console.log("no");
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    if (auth.userType === "appowner") {
      if (auth.userId) {
        fetchData();
      }
    } else if (auth.userType === "influencer") {
      setShowb(true);
    }
  }, [auth.userId, auth.userType]);
  
  return (
    <>
      <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
        <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3">
          <img
            style={{ width: "1200px", height: "250px" }}
            src={
              imgcouverture
                ? "http://localhost:5000/" + imgcouverture
                : "https://via.placeholder.com/1200x250.png"
            }
          />
        </div>

        <div className="card-body p-0 position-relative">
          <figure
            className="avatar position-absolute w100 z-index-1"
            style={{ top: "-40px", left: "30px" }}
          >
            <img
           
              src={
                img
                  ? "http://localhost:5000/" + img
                  : "https://via.placeholder.com/300x300.png"
              }
              className="float-right p-1 bg-white rounded-circle w-100"
            />
          </figure>
          <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">
            {fname} {lname}
            <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">
              {email}
            </span>
          </h4>

          <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
            <div
              className="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg"
              aria-labelledby="dropdownMenu4"
            >
              <div className="card-body p-0 d-flex">
                <i className="feather-bookmark text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Save Link{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Add this to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-alert-circle text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Hide Post{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-alert-octagon text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  Hide all from Group{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
              <div className="card-body p-0 d-flex mt-2">
                <i className="feather-lock text-grey-500 me-3 font-lg"></i>
                <h4 className="fw-600 mb-0 text-grey-900 font-xssss mt-0 me-0">
                  Unfollow Group{" "}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">
                    Save to your saved items
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
          <ul
            className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4"
            id="pills-tab"
            role="tablist"
          >
            <li className="active list-inline-item me-5">
              <a
                className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active"
                href="#navtabs1"
                data-toggle="tab"
              >
                About
              </a>
            </li>
            <Link to={"/events"}>
              {show && (
                <li className="list-inline-item me-5">
                  <a
                    className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
                    href="#navtabs1"
                    data-toggle="tab"
                  >
                    Events
                  </a>
                </li>
              )}
            </Link>
            <Link to={"/note"}>
              {show && (
                <li className="list-inline-item me-5">
                  <a
                    className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
                    href="#navtabs1"
                    data-toggle="tab"
                  >
                    Notes
                  </a>
                </li>
              )}
            </Link>

            <Link to={"/photocouverture"}>
              {show && (
                <li className="list-inline-item ms-auto mt-3 me-4">
                  <a className="">
                    <i
                      className="ti-more-alt text-grey-500 font-xs"
                      style={{ marginLeft: "590px" }}
                    ></i>
                  </a>
                </li>
              )}
            </Link>
            {showb && showContactButton && (
              <li
                style={{ marginLeft: "650px" }}
                className="list-inline-item me-5"
              >
                <Link to={`/defaultmessage/${id}`}>
                  <a
                    className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
                    data-toggle="tab"
                  >
                    Contacter
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfilecardThree;
