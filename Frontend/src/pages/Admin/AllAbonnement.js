import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";
import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";

const AllAbonnement = () => {
  const [search, setSearch] = useState("");
  const [subscriptions, setSubscription] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);

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

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchAbonnement();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchAbonnement = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/abonnement/getbytitle/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setSubscription(result.abonnement);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchAbonnement();
    } else {
      fetchAbonnement();
    }
  }, [search, auth.token]);

  const handleDelete = (subscriptionId) => {
    setSubscription(subscriptions.filter((s) => s._id !== subscriptionId));
    axios
      .delete(`http://localhost:5000/abonnement/${subscriptionId}`)
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
        const response = await fetch(`http://localhost:5000/abonnement/count`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);
        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active bg-white theme-dark-bg">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 cart-wrapper mb-4">
                <Pagetitlegroup
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  value={search}
                  onChange={handleSearch}
                  title={`${count} Subscription`}
                />

                <div className="row">
                  <div className="col-lg-8 mb-3">
                    <div
                      className="table-content table-responsive"
                      style={{ width: "955px" }}
                    >
                      <table className="table text-center">
                        <thead className="bg-greyblue rounded-3">
                          <tr>
                            <th className="border-0 p-4 text-left">Title</th>
                            <th className="border-0 p-4">Price</th>
                            <th className="border-0 p-4">Duration</th>
                            <th className="border-0 p-4">Payment Method</th>
                            <th className="border-0 p-4">Edit</th>
                            <th className="border-0 p-4">Delete</th>
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
                                        {subscription.price}
                                      </span>
                                    </span>
                                  </span>
                                </td>

                                <td className="product-quantity">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      <strong>
                                        <span className="font-xss">
                                          {subscription.duration}
                                        </span>
                                      </strong>
                                    </span>
                                  </span>
                                </td>
                                <td className="product-total-price">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      <strong>
                                        <span className="font-xss">
                                          {subscription.paymentMethod}
                                        </span>
                                      </strong>
                                    </span>
                                  </span>
                                </td>
                                <td className="product-remove">
                                  <Link
                                    to={`/editabonnement/${subscription._id}`}
                                  >
                                    <a>
                                      <i className="ti-pencil-alt font-xs text-grey-500"></i>
                                    </a>
                                  </Link>
                                </td>
                                <td className="product-remove">
                                  <a
                                    onClick={() =>
                                      handleDelete(subscription._id)
                                    }
                                  >
                                    <i className="ti-trash font-xs text-grey-500"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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

export default AllAbonnement;
