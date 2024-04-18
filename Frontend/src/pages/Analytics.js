import React, { Component, Fragment, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import analytic from "../images/aa.jpg";
import Header from "../components/Header";
import ChartistGraph from "react-chartist";
import { Row, Col, Card } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faTag ,faStar,faComment,faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Analytics = () => {
  const auth = useContext(AuthContext);

  const [count, setCount] = useState(0);
  const [count1, setcount1] = useState(0);
  const [error, setError] = useState(false);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [subscriber, setSubscriber] = useState(0);
  const [amount, setAmount] = useState(0);
  const [review, setReview] = useState(0);
  const [comments, setComments] = useState(0);
  const [likes, setLikes] = useState(0);
  const [subscriptions, setSubscription] = useState([]);

  const [influencerCount, setInfluencerCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [influencerPercentage, setInfluencerPercentage] = useState(0);
  const [companyPercentage, setCompanyPercentage] = useState(0);
  const [collaborationsData, setCollaborationsData] = useState([]);

  useEffect(() => {
    const fetchCollaborationsData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/collaboration/dashboard/all"
        );
        const data = await response.json();
        setCollaborationsData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollaborationsData();
  }, []);

  const months = collaborationsData.map((item) => item.month);
  const counts = collaborationsData.map((item) => item.count);

  // Configure the chart options
  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    series: [
      {
        name: "Number of Collaborations",
        data: counts,
      },
    ],
    xaxis: {
      categories: months,
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Number of Collaborations",
      },
    },
    title: {
      text: "Collaboration Chart",
      align: "center",
    },
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response1 = await fetch(
          "http://localhost:5000/influencer/count",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result1 = await response1.json();
        const influencerCount = result1.count;
        setInfluencerCount(influencerCount);

        const response2 = await fetch("http://localhost:5000/appowner/count", {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result2 = await response2.json();
        const companyCount = result2.count;
        setCompanyCount(companyCount);

        const totalUsers = influencerCount + companyCount;
        const influencerPercentage = Math.round(
          (influencerCount / totalUsers) * 100
        );
        const companyPercentage = Math.round((companyCount / totalUsers) * 100);
        setInfluencerPercentage(influencerPercentage);
        setCompanyPercentage(companyPercentage);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();
  }, []);
  const data = [
    { name: "Influencer", percentage: influencerPercentage },
    { name: "Company", percentage: companyPercentage },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/poste/count`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setCount2(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/offer/all/count`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setCount3(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/abonnement/count`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setCount4(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/abonnement/totalabonnement`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setSubscriber(result.totalSubscribers);
      } catch (err) {
        setError(err);
      }
    };

    fetchSubscribers();
  }, []);
  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/abonnement/charge`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setAmount(result.totalAmount);
      } catch (err) {
        setError(err);
      }
    };

    fetchAmount();
  }, []);
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:5000/review/count`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setReview(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchReview();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comment/dashboard/all`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();

        setComments(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchComments();
  }, []);
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/like/dashboard/all`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();

        setLikes(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchLikes();
  }, []);

  useEffect(() => {
    const fetchAbonnement = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/abonnement/abonnement`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setSubscription(result.abonnements);
      } catch (err) {
        setError(err);
      }
    };

    fetchAbonnement();
  }, []);

  return (
    <>
      <Header />

      <div className="main-content bg-white right-chat-active theme-dark-bg">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-lg-6">
                <img src={analytic} alt="banner" className="w-100" />
              </div>
              <div className="col-lg-6 ps-lg-5">
                <h2 className="display1-size d-block mb-2 text-grey-900 fw-700">
                  Set up your Social website with PartnerUp
                </h2>
                <p className="font-xssss fw-500 text-grey-500 lh-26">
                  Unlock the Power of Your Website with Analytics: Measure,
                  Analyze, and Optimize for Success.
                </p>
              </div>

              <div className="col-lg-13"></div>
              <div
                className="dashboard"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  // justifyContent: "center",
                }}
              >
                <div
                  className="dashboard-item"
                  style={{ margin: "10px", marginLeft: "-70px" }}
                >
                  <div
                    className="dashboard-card"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      width: "190px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                      <FontAwesomeIcon
                        icon={faNewspaper}
                        style={{ marginRight: "10px", color: "#663399" }}
                      />
                      Posts
                    </h2>
                    <p
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {count2}
                    </p>
                  </div>
                </div>
                <div className="dashboard-item" style={{ margin: "10px" }}>
                  <div
                    className="dashboard-card"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      width: "190px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                      <FontAwesomeIcon
                        icon={faTag}
                        style={{ marginRight: "10px", color: "#DDA0DD" }}
                      />
                      Offers
                    </h2>
                    <p
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {count3}
                    </p>
                  </div>
                </div>
                <div className="dashboard-item" style={{ margin: "10px" }}>
                  <div
                    className="dashboard-card"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      width: "190px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                    <FontAwesomeIcon icon={faStar} style={{ marginRight: "10px",color:"#F5DEB3" }} />
                      Reviews
                    </h2>
                    <p
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {review}
                    </p>
                  </div>
                </div>
                <div className="dashboard-item" style={{ margin: "10px" }}>
                  <div
                    className="dashboard-card"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      width: "190px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                        <FontAwesomeIcon icon={faComment} style={{ marginRight: "10px" ,color:"#87CEEB"}} />

                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                      Comments
                    </h2>
                    <p
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {comments}
                    </p>
                  </div>
                </div>
                <div className="dashboard-item" style={{ margin: "10px" }}>
                  <div
                    className="dashboard-card"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      width: "170px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                    <FontAwesomeIcon icon={faHeart} style={{ marginRight: "10px" ,color:"#DB7093"}} />

                      Likes
                    </h2>
                    <p
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        margin: "0",
                      }}
                    >
                      {likes}
                    </p>
                  </div>
                </div>
                <div className="col-lg-7 mb-3" style={{ marginTop: "110px",marginLeft:"-30px" }}>
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type={chartOptions.chart.type}
                    height={chartOptions.chart.height}
                  />
                </div>
                <div style={{ marginTop: "70px" }}>
                  <BarChart width={400} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#4169E1" />
                  </BarChart>
                </div>
              </div>
            </div>

            <div className="col-lg-8 mb-3">
              <div
                className="table-content table-responsive"
                style={{ width: "955px" }}
              >
                <table
                  className="table text-center"
                  style={{ marginBottom: "50px" }}
                >
                  <thead className="bg-greyblue rounded-3">
                    <tr>
                      <th className="border-0 p-4 text-left">Title</th>

                      <th className="border-0 p-4">Duration</th>
                      <th className="border-0 p-4">Number of subscribers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions &&
                      subscriptions.map((subscription) => (
                        <tr key={subscription._id}>
                          <td className="product-headline text-left wide-column">
                            <span className="product-price-wrapper">
                              <span className="money fmont">
                                <strong>
                                  <span className="font-xss">
                                    {subscription.title}
                                  </span>
                                </strong>
                              </span>
                            </span>
                          </td>
                          <td className="product-p">
                            <span className="product-price-wrapper">
                              <span className="money text-grey-500 fw-600 font-xsss">
                                <span className="font-xsss">
                                  {subscription.duration}
                                </span>
                              </span>
                            </span>
                          </td>

                          <td className="product-quantity">
                            <span className="product-price-wrapper">
                              <span className="money fmont">
                                <strong>
                                  <span className="font-xss">
                                    {subscription.numberOfSubscribers}
                                  </span>
                                </strong>
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td className="product-quantity" colSpan={3}>
                        <span className="product-price-wrapper">
                          <span className="money fmont">
                            <strong>
                              <span className="font-xss">
                                Total Amount: {amount} $
                              </span>
                            </strong>
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Fragment />
    </>
  );
};

export default Analytics;
