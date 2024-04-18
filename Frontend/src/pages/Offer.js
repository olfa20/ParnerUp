import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import GoogleMapReact from "google-map-react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DeleteButton from "../components/Offer/DeleteButton";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Search from "../components/Search/Search";

const Offer = () => {
  const [error, setError] = useState(false);
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  let { id } = useParams();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/offer/${id}?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setOffers(result);
      setHasMore(result.length > 0);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  console.log(id);
  useEffect(() => {
    const searchOffer = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/offer/search/${search}/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setOffers(result.offer);
        setHasMore(false);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (search) {
      searchOffer();
    } else {
      fetchOffers();
    }
  }, [search, auth.token, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setOffers([]);
  };

  const handleDelete = (offerID) => {
    setOffers(offers.filter((c) => c._id !== offerID));
    axios
      .delete(`http://localhost:5000/offer/${offerID}`)
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
          `http://localhost:5000/offer/count/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
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

      <div className="main-content bg-white right-chat-active theme-dark-bg">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row">
              <div className="col-xl-12 col-xxl-12 col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                      <div className="bg-pattern-div"></div>
                      <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                        Offers{" "}
                      </h2>
                    </div>
                    <Search
                      type="text"
                      placeholder="Search"
                      className="form-control"
                      value={search}
                      onChange={handleSearch}
                      title={`${count} Offers`}
                    />
                  </div>

                  {offers &&
                    offers.map((offer) => (
                      <div key={offer._id} className="col-lg-4 col-md-6">
                        <div className="card w-100 border-0 mt-4">
                          <div className="card-image w-100 p-0 text-center bg-greylight rounded-3 mb-2">
                            <a href={`/detailoffer/${offer._id}`}>
                              <img
                                src={
                                  offer.media
                                    ? "http://localhost:5000/" + offer.media
                                    : "https://via.placeholder.com/300x300.png"
                                }
                                alt="product"
                                className="w-100 mt-0 mb-0 p-5"
                              />
                            </a>
                          </div>
                          <div className="card-body w-100 p-0 text-center">
                            <h2 className="mt-2 mb-1">
                              <a
                                href="/singleproduct"
                                className="text-black fw-700 font-xsss lh-26"
                              >
                                {offer.title}
                              </a>
                            </h2>

                            <h6 className="font-xsss fw-600 text-grey-500 ls-2">
                              {offer.price}
                            </h6>
                          </div>
                          <div style={{ marginLeft: "210px" }}>
                            <Link to={`/editoffer/${offer._id}`}>
                              <button className="btn btn-sm btn-link mx-1">
                                <FaEdit />
                              </button>
                            </Link>
                            <button
                              className="btn btn-sm btn-link mx-1"
                              onClick={() => handleDelete(offer._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className="col-lg-12 mt-3 mb-5 text-center">
                    <a
                      onClick={() => handleLoadMore()}
                      className="fw-700 text-white font-xssss text-uppercase ls-3 lh-32 rounded-3 mt-3 text-center d-inline-block p-2 bg-current w150"
                    >
                      Load More
                    </a>
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

export default Offer;
