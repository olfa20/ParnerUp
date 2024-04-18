import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import Leftnav from "../../components/Leftnav";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import Popupchat from "../../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import DisplayMessage from "../../components/DisplayMessage";

const OfferSearch = () => {
  const [error, setError] = useState(false);
  const [offers, setOffers] = useState([]);
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  let { id } = useParams();
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/offer/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();

        setOffers(result);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchOffers();
    }
  }, [id]);

  const handleApply = async (offerId) => {
    console.log(offerId);
    try {
      const response = await fetch(
        `http://localhost:5000/notification/apply/${auth.userId}/${offerId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setShowModal(true);
        setModalMessage("Your application has been submitted successfully!");
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

  const handelFavoris = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/favoris/${offerId}/${auth.userId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert("This Offer is added in you favorite list !");
      } else {
        alert(result.message);
      }
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
            <div className="row">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="col-lg-4 col-md-6 pe-2 ps-2"
                  style={{ marginTop: "10px" }}
                >
                  <div
                    className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden "
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div className="card-image w-100">
                      <img
                        src={
                          offer.media
                            ? "http://localhost:5000/" + offer.media
                            : "https://via.placeholder.com/300x300.png"
                        }
                        alt="event"
                        className="w-100 rounded-3"
                      />
                    </div>
                    <div className="card-body d-flex ps-0 pe-0 pb-0">
                      <div className="bg-greylight me-3 p-3 border-light-md rounded-xxl theme-dark-bg">
                        <h4 className="fw-700 font-lg ls-3 text-grey-900 mb-0">
                          <span className="ls-3 d-block font-xsss text-grey-500 fw-500">
                            {offer.title}
                          </span>

                          <p style={{ fontSize: "17px" }}> Requirements</p>
                          <p
                            style={{
                              fontSize: "10px",
                              whiteSpace: "pre-line",
                              wordBreak: "break-word",
                            }}
                          >
                            {" "}
                            -{offer.requirements}{" "}
                          </p>
                          <p style={{ fontSize: "17px" }}> Offers</p>
                          <p style={{ fontSize: "10px" }}>
                            {offer.responsibilities}
                          </p>

                          <p style={{ fontSize: "17px" }}> Address</p>
                          <p style={{ fontSize: "10px" }}>{offer.address}</p>
                          <p style={{ fontSize: "17px" }}>
                            <i class="ti-calendar"></i> {offer.dateEvent}
                          </p>
                          <span className="font-lg fw-700 mt-0 pe-3 ls-2 lh-32 d-inline-block text-success float-left">
                            <span className="font-xsssss">$</span>
                            {offer.price}{" "}
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <FontAwesomeIcon
                        icon={faBookmark}
                        onClick={() => {
                          handelFavoris(offer._id);
                        }}
                      />

                      <button
                        style={{ border: "none" }}
                        className="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1"
                        onClick={() => handleApply(offer._id)}
                      >
                        Apply
                      </button>
                      <DisplayMessage
                        isOpen={showModal}
                        message={modalMessage}
                        onClose={handleCloseModal}
                      />

                      <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                        {new Date(offer.date).toLocaleDateString()}
                      </span>
                      <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                        {new Date(offer.date).toLocaleTimeString()}
                      </span>
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

export default OfferSearch;
