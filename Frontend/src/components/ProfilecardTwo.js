import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";

const ProfilecardTwo = ({ company, email, img, couverture, id }) => {
  const auth = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const [showb, setShowb] = useState(false);

  useEffect(() => {
    if (id) {
      setShow(false);
    }
  }, [id, auth.userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (auth.userType === "influencer") {  
          response = await fetch(`http://localhost:5000/influencerapp/${id}/`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          });
          const result = await response.json();

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
        } else if (auth.userType === "appowner") {
          response = await fetch(
            `http://localhost:5000/application/${id}/${auth.userId}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          const result = await response.json();
          console.log(result.userServices, "res");

          if (
            result.services &&
            result.services.some((service) => service.includes("Chat Message")) &&
             result.userServices && result.userServices.some((service) => service.includes("Chat Message") )
          ) {
            setShowb(true);
            console.log("oui");
          } else {
            setShowb(false);
            console.log("no");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, auth]);

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3 overflow-hidden">
      <div
        className="card-body position-relative h240 bg-image-cover bg-image-center"
        style={{
          backgroundImage: `url(${
            "http://localhost:5000/" + couverture?.replace(/\\/g, "/") ||
            "https://via.placeholder.com/1200x450.png"
          })`,
        }}
      ></div>

      <div className="card-body d-block pt-4 text-center position-relative">
        <figure className="avatar mt--6 position-relative w75 z-index-1 w100 z-index-1 ms-auto me-auto">
          <img
            src={
              img
                ? "http://localhost:5000/" + img
                : "https://via.placeholder.com/300x300.png"
            }
            alt="avater"
            className="p-1 bg-white rounded-xl w-100"
          />
        </figure>

        <h4 className="font-xs ls-1 fw-700 text-grey-900">
          {company}{" "}
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {email}
          </span>
        </h4>

        <div className="d-flex align-items-center justify-content-center position-absolute right-15 top-10 mt-2 me-2">
          {showb && !show && (
            <Link to={`/defaultmessage/${id}`}>
              <a className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700">
                <i className="feather-mail font-md"></i>
              </a>
            </Link>
          )}

          <div
            className="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg"
            aria-labelledby="dropdownMenu8"
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

          <Link to={"/photocouverture"}>
            {show && (
              <li className="list-inline-item ms-auto mt-3 me-4">
                <a className="">
                  <i
                    className="ti-more-alt text-grey-500 font-xs"
                    style={{ marginLeft: "700px" }}
                  ></i>
                </a>
              </li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default ProfilecardTwo;
