import React, { Component, Fragment, useEffect, useState } from "react";
import Appfooter from "../../components/Appfooter";
import { useParams, useHistory } from "react-router-dom";
import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Popupchat from "../../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import Slider from "react-slick";
import DisplayMessage from "../../components/DisplayMessage";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Review = () => {
  const [modalMessage, setModalMessage] = useState("");

  const history = useHistory();
  let { id } = useParams();
  const auth = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formdata, setFormdata] = useState({
    userType: "",
    influencer: "",
    company: "",
    reviewMessage: "",
  });
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [result, setResult] = useState();
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  const HandleYes = (event) => {
    setResult("Yes");
  };
  const HandleNo = (event) => {
    setResult("No");
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        const response = await fetch("http://localhost:5000/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            influencerId: auth.userId,
            companyId: id,
            result: result,
            reviewMessage: formdata.reviewMessage,
          }),
        });
        const responseData = await response.json();

        if (!response.ok) {
          setError(true);
          setMessage(responseData.message);
          throw new Error(responseData.message);
        }

        history.go(0);
      } catch (error) {
        setError(error.message);
        setShowModal(true);
        setModalMessage(error.message);
      }
    }
  };

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/review/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        console.log(result);
        setReviews(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchReviews();
    }
  }, [auth.userId]);

  const handleDelete = (reviewId) => {
    setReviews(reviews.filter((r) => r._id !== reviewId));
    axios
      .delete(`http://localhost:5000/review/${reviewId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/review/count/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        setYesCount(result.numYes);
        setNoCount(result.numNo);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchNumber();
    }
  }, [id]);
  const data = [
    { name: "Yes", count: yesCount },
    { name: "No", count: noCount },
  ];

  const totalVotes = yesCount + noCount;
  const yesPercentage =
    totalVotes === 0 ? 0 : ((yesCount / totalVotes) * 100).toFixed(2);
  const noPercentage =
    totalVotes === 0 ? 0 : ((noCount / totalVotes) * 100).toFixed(2);

  return (
    <form onSubmit={submitHandler}>
      <Fragment>
        <Header />

        <div
          className="main-content right-chat-active"
          style={{ height: "1000px" }}
        >
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row"></div>

              <div className="row">
                <div className="col-xl-8 col-xxl-9 col-lg-8">
                  <div className="card d-block mt-3 border-0 shadow-xss bg-white p-lg-5 p-4">
                    <h2 className="fw-700 font-lg mt-3 mb-2">
                      Share your thoughts and add a review here
                    </h2>
                    <p className="font-xsss fw-500 text-grey-500 lh-30 pe-5 mt-3 me-5">
                      Do you like the collaboration?
                    </p>

                    <div className="clearfix"></div>

                    <form
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <label
                          htmlFor="Yes"
                          style={{
                            marginRight: "30px",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          <input
                            type="radio"
                            id="Yes"
                            name="userType"
                            value={result}
                            checked={result === "Yes"}
                            onChange={HandleYes}
                          />
                          Yes
                        </label>
                        <label
                          htmlFor="No"
                          style={{ fontSize: "18px", fontWeight: "bold" }}
                        >
                          <input
                            type="radio"
                            id="No"
                            name="userType"
                            value={result}
                            checked={result === "No"}
                            onChange={HandleNo}
                          />
                          No
                        </label>
                      </div>
                      <textarea
                        style={{
                          marginTop: "20px",
                          height: "100px",
                          width: "100%",
                          padding: "10px",
                          fontSize: "18px",
                          borderRadius: "5px",
                          border: "2px solid #ccc",
                          boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.1)",
                          resize: "none",
                        }}
                        placeholder="Write your review message here..."
                        value={formdata.reviewMessage}
                        onChange={handleChange}
                        name="reviewMessage"
                      />
                    </form>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        style={{
                          marginTop: "20px",
                          padding: "10px 20px",
                          backgroundColor: "#F2F2F2",
                          color: "black",
                          fontSize: "18px",
                          border: "none",
                          borderRadius: "5px",
                        }}
                        type="submit"
                      >
                        Send{" "}
                      </button>
                      <DisplayMessage
                        isOpen={showModal}
                        message={modalMessage}
                        onClose={handleCloseModal}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#79B4B7",
                          height: "30px",
                          width: `${yesPercentage}%`,
                          borderRadius: "5px",
                          maxWidth: "50%",
                        }}
                      >
                        <p
                          style={{
                            margin: "5px",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Yes: {yesPercentage}% ({yesCount})
                        </p>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#EC5252",
                          height: "30px",
                          width: `${noPercentage}%`,
                          borderRadius: "5px",
                          maxWidth: "50%",
                        }}
                      >
                        <p
                          style={{
                            margin: "5px",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          No: {noPercentage}% ({noCount})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-xxl-3 col-lg-4 ps-0">
                  <div className="card w-100 border-0 mt-3 mb-4 p-lg-4 p-3 shadow-xss position-relative rounded-3 bg-white">
                    {reviews &&
                      reviews.map((review) => (
                        <div key={review._id} className="row">
                          <div className="col-2 text-left">
                            <figure className="avatar float-left mb-0">
                              <img
                                src={
                                  review.influencer.profileImage
                                    ? "http://localhost:5000/" +
                                      review.influencer.profileImage
                                    : "https://via.placeholder.com/300x300.png"
                                }
                                alt="avater"
                                className="float-right shadow-none w40 me-2"
                              />
                            </figure>
                          </div>
                          <div className="col-10 ps-4">
                            <div className="content">
                              <h6 className="author-name font-xssss fw-600 mb-0 text-grey-800">
                                {review.influencer.fname}{" "}
                                {review.influencer.lname}
                                {auth.userId === review.influencer._id && (
                                  <span
                                    className="text-gray pointer"
                                    style={{ marginLeft: "110px" }}
                                  >
                                    <AiOutlineDelete
                                      onClick={() => handleDelete(review._id)}
                                    />
                                  </span>
                                )}
                              </h6>
                              <h6 className="d-block font-xsssss fw-500 text-grey-500 mt-2 mb-0">
                                {new Date(review.Date).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </h6>
                              <p className="comment-text lh-24 fw-500 font-xssss text-grey-500 mt-2">
                                {review.reviewMessage}
                              </p>
                            </div>
                          </div>
                        </div>
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
    </form>
  );
};

export default Review;
