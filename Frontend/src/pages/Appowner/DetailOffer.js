import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import Leftnav from "../../components/Leftnav";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import Popupchat from "../../components/Popupchat";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import { Link, useHistory } from "react-router-dom";
import DisplayMessage from "../../components/DisplayMessage";
import { FaHeart } from "react-icons/fa";

const DetailOffer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const history = useHistory();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const [formdata, setFormdata] = useState({
    title: "",
    overview: "",
    responsibilities: "",
    requirements: "",
    created_by: "",
    dateEvent: "",
    media: "",
    date: "",
    address: "",
    price: "",
  });
  const { offerId } = useParams();
  const auth = useContext(AuthContext);
  const [oldImg, setOldImg] = useState();
  const [favorited, setFavorited] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/offer/offer/${offerId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);

        setFormdata(result);
        setOldImg(
          result.media
            ? "http://localhost:5000/" + result.media
            : "https://via.placeholder.com/300x300.png"
        );
      } catch (err) {
        setError(err);
      }
    };

    if (offerId) {
      fetchOffers();
    }
  }, []);

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

  // set favorited status in local storage
  useEffect(() => {
    const favoritedOffer = localStorage.getItem(offerId);
    if (favoritedOffer === "favorited") {
      setFavorited(true);
    } else {
      setFavorited(false);
    }
  }, [offerId]);

  // update favorited status in local storage
  useEffect(() => {
    if (favorited === true) {
      localStorage.setItem(offerId, "favorited");
    } else {
      localStorage.removeItem(offerId);
    }
  }, [offerId, favorited]);

  const handleFavoris = async (offerId, influencerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/favoris/${offerId}/${auth.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            influencerId: influencerId,
          }),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        return responseData.favoris ? true : false;
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // const handleFavoris = async (offerId) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/favoris/${offerId}/${auth.userId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: "Bearer " + auth.token,
  //         },
  //       }
  //     );
  //     const result = await response.json();

  //     setFavorited(true); // set favorited to true when added to favoris
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-lg-5 mb-4 shop-slider">
                <Slider>
                  <div className="pt-lg--10 pb-lg--10 bg-white rounded-3">
                    <img
                      src={
                        formdata.media
                          ? "http://localhost:5000/" + formdata.media
                          : "https://via.placeholder.com/300x300.png"
                      }
                      alt="avater"
                      className="rounded-3 img-fluid"
                    />
                  </div>
                </Slider>
              </div>

              <div className="col-lg-6  col-md-12 pad-top-lg-200 pad-bottom-lg-100 pad-top-100 pad-bottom-75 ps-md--5">
                <h2 className="fw-700 text-grey-900 display1-size lh-3 porduct-title display2-md-size">
                  {" "}
                  {formdata.title}
                </h2>

                <div className="clearfix"></div>
                <p className="font-xsss fw-400 text-grey-500 lh-30 pe-5 mt-3 me-5">
                  {formdata.responsibilities}
                </p>

                <h6 className="display2-size fw-700 text-current ls-2 mb-2">
                  <span className="font-xl">$</span>
                  {formdata.price}{" "}
                </h6>
                <div className="timer bg-white mt-2 mb-0 w350 rounded-3"></div>
                <div className="clearfix"></div>
                <form action="#" className="form--action mt-4 mb-3">
                  {auth.userId !== formdata.created_by && (
                    <div className="product-action flex-row align-items-center">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => handleApply(offerId)}
                        className="add-to-cart bg-dark text-white fw-700 ps-lg-5 pe-lg-5 text-uppercase font-xssss float-left border-dark border rounded-3 border-size-md d-inline-block mt-0 p-3 text-center ls-3"
                      >
                        Apply
                      </a>
                      <DisplayMessage
                        isOpen={showModal}
                        message={modalMessage}
                        onClose={handleCloseModal}
                      />

                      <a
                        className={`btn-round-xl d-inline-block mt-0 ms-4 float-left ${
                          favorited === true ? "alert-danger" : "alert-dark"
                        }`}
                        onClick={() => {
                          handleFavoris(offerId);
                          setFavorited(!favorited);
                        }}
                      >
                        <FaHeart />
                      </a>
                    </div>
                  )}
                </form>

                <div className="clearfix"></div>
                <ul className="product-feature-list mt-5">
                  <li className="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">
                    <b className="text-grey-900"> Address : </b>{" "}
                    <a
                      href={`https://www.google.com/maps?q=${formdata.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formdata.address}
                    </a>
                  </li>

                  <li className="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">
                    <b className="text-grey-900">Date event : </b>{" "}
                    {new Date(formdata.date).toLocaleDateString()}

                  </li>
                  <li className="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"></li>
                  <li className="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">
                    <b className="text-grey-900"> </b>
                  </li>
                  <li className="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"></li>
                </ul>
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

export default DetailOffer;
