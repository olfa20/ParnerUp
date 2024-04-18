import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import Slider from "react-slick";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Link, useParams } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const DetailAbonnement = () => {
  const publishKey =
    "pk_test_51Mp8SmFVn0fL1E7DlhHzy0FdUO0aZgMJjZNvqSPWYHudXVtdnDUKdFwHmWsCNM4teuVJmOSJPi69mbhBFyeoQaXB00BSrUKDzk";

  let { id } = useParams();
  const [oldImg, setOldImg] = useState();
  const [error, setError] = useState(null);
  const [formdata, setFormdata] = useState({
    title: "",
    services: "",
    price: 0,
    duration: "",
    paymentMethod: "",
    media: "",
    created_by: "",
    description: "",
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`http://localhost:5000/abonnement/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();

        setFormdata(result.abonnement);
        setOldImg(
          result.abonnement.media
            ? "http://localhost:5000/" + result.abonnement.media
            : "https://via.placeholder.com/300x300.png"
        );
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchSubscription();
    }
  }, [id]);
  const auth = useContext(AuthContext);

 

  const payNow = async (token) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/abonnement/${id}`,
        method: "post",
        data: {
          amount: formdata.price * 100,
          token,
          userId: auth.userId,
        },
      });
      if (response.status === 200) {
        console.log("You payment was successful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-lg-12"></div>
            </div>
            <div className="row">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className="card d-block mt-3 border-0 shadow-xss bg-white p-lg-5 p-4">
                  <h2 className="fw-700 font-lg mt-3 mb-2">{formdata.title}</h2>
                  <p className="font-xsss fw-500 text-grey-500 lh-30 pe-5 mt-3 me-5">
                    {formdata.description}
                  </p>

                  <div className="clearfix"></div>

                  <h5 className="mt-4 mb-4 d-inline-block font-xsss fw-600 text-grey-500">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="me-1"
                      style={{ color: "#3366ff" }}
                    />

                    {formdata.paymentMethod}
                  </h5>
                  <div className="clearfix"></div>

                  <StripeCheckout
                    stripeKey={publishKey}
                    label="Pay now"
                    name="Pay with Credit Card"
                    billingAddress
                    shippingAddress
                    amount={formdata.price}
                    description={`your total is ${formdata.price}`}
                    token={payNow}
                  />
                </div>

                <div className="card d-block border-0 rounded-3 overflow-hidden p-4 shadow-xss mt-4 alert-success">
                  <h2 className="fw-700 font-sm mb-3 mt-1 ps-1 text-success mb-4">
                    Services
                  </h2>
                  {formdata.services &&
                    formdata.services.map((service) => (
                      <h4 className="font-xssss fw-500 text-grey-600 mb-3 pl-35 position-relative lh-24">
                        <i className="ti-check font-xssss btn-round-xs bg-success text-white position-absolute left-0 top-5"></i>
                        {service}
                      </h4>
                    ))}
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

export default DetailAbonnement;
