import React, { Component, Fragment, useEffect, useState } from "react";
import Appfooter from "../../components/Appfooter";
import Header from "../../components/Header";
import Leftnav from "../../components/Leftnav";
import Rightchat from "../../components/Rightchat";
import Popupchat from "../../components/Popupchat";
import { AuthContext } from "../../shared/authContext";
import { useContext } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";

import { Link, useHistory } from "react-router-dom";

const CondidatAccepted = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [condidats, setCondidats] = useState([]);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [statusProgress, setStatusProgress] = useState(0);
  const [statusCompleted, setStatusCompleted] = useState(0);

  const fetchCondidat = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/condidat/${auth.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setCondidats(result);
    } catch (err) {
      setError(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchCondidat();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchCondidat = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/condidat/getbytitle/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setCondidats(result.condidat);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchCondidat();
    } else {
      fetchCondidat();
    }
  }, [search, auth.token]);

  const handleDelete = (condidatId) => {
    setCondidats(condidats.filter((c) => c._id !== condidatId));
    axios
      .delete(`http://localhost:5000/condidat/${condidatId}`)
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
        const response = await fetch(
          `http://localhost:5000/condidat/count/${auth.userId}`,
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

  const handleComplete = async (condidatId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/condidat/${condidatId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log(result);

      history.push(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/condidat/status/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setStatusProgress(result.progress);
        setStatusCompleted(result.completed);
      } catch (err) {
        setError(err);
      }
    };

    fetchPrice();
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
                  title={`Collaborations`}
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
                            <th className="border-0 p-4 text-left">
                              Title Job
                            </th>
                            <th className="border-0 p-4">Date </th>
                            <th className="border-0 p-4">Influencer </th>
                            <th className="border-0 p-4">Phone</th>
                            <th className="border-0 p-4">Status</th>
                            <th className="border-0 p-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {condidats &&
                            condidats.map((condidat) => (
                              <tr key={condidat._id}>
                                <td className="product-headline text-left wide-column">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      <strong>
                                        <span className="font-xss">
                                          {condidat.job?.title}
                                        </span>
                                      </strong>
                                    </span>
                                  </span>
                                </td>
                                <td className="product-p">
                                  <span className="product-price-wrapper">
                                    <span className="money text-grey-500 fw-600 font-xsss">
                                      <span className="font-xsss">
                                        {condidat.job?.dateEvent}
                                      </span>
                                    </span>
                                  </span>
                                </td>

                                <td className="product-quantity">
                                  <span className="product-price-wrapper">
                                    <span className="money fmont">
                                      <strong>
                                        <span className="font-xss">
                                          {condidat.influencer?.fname}{" "}
                                          {condidat.influencer?.lname}
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
                                          {condidat.influencer?.phone}
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
                                          {condidat?.status}
                                        </span>
                                      </strong>
                                    </span>
                                  </span>
                                </td>
                                <td className="product-remove">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => {
                                      handleComplete(condidat._id);
                                      window.location.reload();
                                    }}
                                  >
                                    Finish
                                  </button>
                                </td>

                                <td className="product-remove">
                                  <a onClick={() => handleDelete(condidat._id)}>
                                    <i className="ti-trash font-xs text-grey-500"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <hr />
                      <a
                        href="/recommendation"
                        className="update-cart bg-dark float-right text-white fw-600 text-uppercase font-xssss border-dark border rounded-3 border-size-md d-inline-block w175 p-3 text-center ls-3"
                      >
                        Recommendation
                      </a>
                      <div
                        style={{
                          backgroundColor: "#F4F6F9",
                          padding: "1rem",
                          borderRadius: "10px",
                          margin: "0 auto",
                          maxWidth: "500px",
                        }}
                      >
                        <h4
                          style={{
                            color: "#36454F",
                            marginBottom: "1rem",
                            textAlign: "center",
                            color: "#44A4E2",
                            fontSize: "19px",
                          }}
                        >
                          Summary
                        </h4>
                        <form
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label
                              style={{
                                marginBottom: "0.5rem",
                                color: "#36454F",
                              }}
                            >
                              Collaborations with status "In Progress":
                            </label>
                            <h3 style={{ margin: "0", color: "#44A4E2" }}>
                              {statusProgress}
                            </h3>
                          </div>
                          <div
                            style={{
                              width: "2px",
                              height: "80px",
                              backgroundColor: "#C4C4C4",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <label
                              style={{
                                marginBottom: "0.5rem",
                                color: "#36454F",
                              }}
                            >
                              Collaborations with status "Completed":
                            </label>
                            <h3 style={{ margin: "0", color: "#44A4E2" }}>
                              {" "}
                              {statusCompleted}{" "}
                            </h3>
                          </div>
                        </form>
                      </div>
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

export default CondidatAccepted;
