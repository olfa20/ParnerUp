import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";
import { useContext } from "react";
import axios from "axios";
import Pagetitlegroup from "../components/Admin/Pagetitlegroup";

const Collaboration = () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [collaborations, setCollaborations] = useState([]);
  const [message, setMessage] = useState();
  const [price, setPrice] = useState(0);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [company, setCompany] = useState(0);

  const fetchCollaboration = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/collaboration/${auth.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setCollaborations(result);
    } catch (err) {
      setError(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchCollaboration();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchCollaboration = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/collaboration/getbytitle/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setCollaborations(result.collaboration);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchCollaboration();
    } else {
      fetchCollaboration();
    }
  }, [search, auth.token]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/collaboration/count/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();

        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/collaboration/price/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setPrice(result.total);
      } catch (err) {
        setError(err);
      }
    };

    fetchPrice();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/collaboration/appownernumber/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setCompany(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCompany();
  }, []);

  const handleDelete = (collaborationId) => {
    setCollaborations(collaborations.filter((c) => c._id !== collaborationId));
    axios
      .delete(`http://localhost:5000/collaboration/${collaborationId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active bg-white theme-dark-bg">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 cart-wrapper mb-4">
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                      <div className="bg-pattern-div"></div>
                      <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                        Collaborations{" "}
                        <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block">
                         
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-lg-8 mb-3"
                    style={{ marginRight: "20px" }}
                  >
                    <div className="table-content table-responsive">
                      <table className="table text-center">
                        <thead className="bg-greyblue rounded-3">
                          <tr>
                            <th className="border-0 p-4">&nbsp;</th>
                            <th className="border-0 p-4 text-left">
                              Title Collaboration
                            </th>
                            <th className="border-0 p-4">Price</th>
                            <th className="border-0 p-4">Company</th>
                            <th className="border-0 p-4">Date Collaboration</th>
                            <th className="border-0 p-4">&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collaborations &&
                            collaborations.map((collaboration) => (
                              <tr key={collaboration._id}>
                                <td className="product-thumbnail text-left ps-0">
                                  <img
                                    src={
                                      collaboration?.job.media
                                        ? "http://localhost:5000/" +
                                          collaboration?.job.media
                                        : "https://via.placeholder.com/75x100.png"
                                    }
                                    alt="Product Thumnail"
                                    className="w75 rounded-3"
                                  />
                                </td>
                                <td className="product-headline text-left wide-column">
                                  <h3>
                                    <a
                                      href="/cart"
                                      className="text-grey-900 fw-600 font-xsss"
                                    >
                                      {collaboration.job?.title}
                                    </a>
                                  </h3>
                                </td>
                                <td className="product-p">
                                  <span className="product-price-wrapper">
                                    <span className="money text-grey-500 fw-600 font-xsss">
                                      <span className="font-xsssss">$</span>{" "}
                                      {collaboration?.job.price}
                                    </span>
                                  </span>
                                </td>
                                <td className="product-quantity">
                                  <h3>
                                    <a
                                      href="/cart"
                                      className="text-grey-900 fw-600 font-xsss"
                                    >
                                      {collaboration?.appowner.company}{" "}
                                    </a>
                                  </h3>
                                </td>
                                <td className="product-total-price">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      <strong>
                                        <span className="font-xsssss"> </span>
                                        {collaboration?.job.dateEvent}
                                      </strong>
                                    </span>
                                  </span>
                                </td>
                                <td className="product-remove text-right">
                                  <a
                                    onClick={() =>
                                      handleDelete(collaboration._id)
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
                  <div className="col-lg-3" style={{ width: "310px" }}>
                    <div className="checkout-payment card border-0 mb-3 bg-greyblue p-4">
                      <div className="cart-totals">
                        <h4 className="mont-font fw-600 font-md mb-5">
                          Cart totals
                        </h4>
                        <div className="table-content table-responsive">
                          <table className="table order-table">
                            <tbody>
                              <tr>
                                <td className="font-xsss pt-2 fw-600">
                                  Company
                                </td>
                                <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">
                                  {company}
                                </td>
                              </tr>
                              <tr>
                                <td className="font-xsss pt-2 fw-600">
                                  Collaborations
                                </td>
                                <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">
                                  <span>{count}</span>
                                </td>
                              </tr>
                              <tr className="order-total">
                                <td className="font-xsss pt-2 fw-600">Price</td>
                                <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      ${price}
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* <a
                      href="/cart"
                      className="bg-dark float-right text-white fw-600 text-uppercase font-xsss border-dark border rounded-3 border-size-md d-inline-block w-100 p-3 text-center ls-3"
                    >
                      Proceed To Checkout
                    </a> */}
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

export default Collaboration;
