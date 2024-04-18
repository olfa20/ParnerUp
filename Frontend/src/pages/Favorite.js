import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../components/Leftnav";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";
import Header from "../components/Header";
import Rightchat from "../components/Rightchat";
import { useContext } from "react";
import axios from "axios";
import Appfooter from "../components/Appfooter";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Favorite = () => {
  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/favoris/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setFavorites(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchFavorite();
    }
  }, [auth.userId]);

  const handleDelete = (favoriteId) => {
    setFavorites(favorites.filter((f) => f._id !== favoriteId));
    axios
      .delete(`http://localhost:5000/favoris/${favoriteId}`)
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
      <div className="d-flex flex-row">
        <div className="flex-grow-1">
          <div
            className="main-content bg-white right-chat-active theme-dark-bg"
            style={{ height: "1000px" }}
          >
            <div className="middle-sidebar-bottom">
              <div className="middle-sidebar-left">
                <div className="row">
                  <div className="col-xl-12 col-xxl-12 col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                          <div className="bg-pattern-div"></div>
                          <h2 className="display1-size display2-md-size fw-700 text-white mb-0 mt-0">
                            Favorites{" "}
                          </h2>
                        </div>
                      </div>

                      {favorites.length > 0 ? (
                        favorites.map((favorite) => (
                          <div key={favorite._id} className="col-lg-4 col-md-6">
                            <div className="card w-100 border-0 mt-4">
                              <div className="card-image w-100 p-0 text-center bg-greylight rounded-3 mb-2">
                                <Link to={`/offer/${favorite.created_by}`}>
                                  <a>
                                    <img
                                      src={
                                        favorite.media
                                          ? "http://localhost:5000/" +
                                            favorite.media
                                          : "https://via.placeholder.com/300x300.png"
                                      }
                                      alt="product"
                                      className="w-100 mt-0 mb-0 p-5"
                                    />
                                  </a>
                                </Link>
                              </div>
                              <div className="card-body w-100 p-0 text-center">
                                <h2 className="mt-2 mb-1">
                                  <a
                                    href="/singleproduct"
                                    className="text-black fw-700 font-xsss lh-26"
                                  >
                                    {favorite.title}
                                  </a>
                                </h2>
                                <h6 className="font-xsss fw-600 text-grey-500 ls-2">
                                  {favorite.address}
                                </h6>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="col-12 text-center"
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          <p style={{ color: "gray" }}>
                            There are no favorites yet.
                          </p>
                        </div>
                      )}
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

export default Favorite;
