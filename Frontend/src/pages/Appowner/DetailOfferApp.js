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

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
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
                    <b className="text-grey-900">Date event: </b>{" "}
                    {formdata.date && (
                      <span>
                        {new Date(formdata.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    )}
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
