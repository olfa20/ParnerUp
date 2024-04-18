import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";
import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";

const Cart = () => {
  const [appowners, setAppowner] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const auth = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/appowner`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const result = await response.json();

      setAppowner(result.users);
    } catch (err) {
      setError(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchUsers();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/appowner/getappbyname/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setAppowner(result);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchUsers();
    } else {
      fetchUsers();
    }
  }, [search, auth.token]);

  const handleDelete = (appOwnerId) => {
    setAppowner(appowners.filter((a) => a._id !== appOwnerId));
    axios
      .delete(`http://localhost:5000/appowner/${appOwnerId}`)
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
        const response = await fetch(`http://localhost:5000/appowner/count`, {
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
                  title={`${count} Appowner`}
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
                            <th className="border-0 p-4">&nbsp;</th>
                            <th className="border-0 p-4 text-left">Company</th>
                            <th className="border-0 p-4">Email</th>
                            <th className="border-0 p-4">Phone</th>
                            <th className="border-0 p-4">City</th>

                            <th className="border-0 p-4">Disable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appowners.map((appowner) => (
                            <tr key={appowner._id}>
                              <td className="product-thumbnail text-left ps-0">
                                <img
                                  src={
                                    appowner.profileImage
                                      ? "http://localhost:5000/" +
                                        appowner.profileImage
                                      : "https://via.placeholder.com/75x100.png"
                                  }
                                  alt="Product Thumnail"
                                  className="w75 rounded-3"
                                />
                              </td>

                              <td className="product-total-price">
                                <span className="product-price-wrapper">
                                  <span className="money fmont">
                                    <strong>
                                      <span className="font-xss">
                                        {appowner.company}
                                      </span>
                                    </strong>
                                  </span>
                                </span>
                              </td>
                              <td className="product-p">
                                <span className="product-price-wrapper">
                                  <span className="money text-grey-500 fw-600 font-xsss">
                                    <span className="font-xsss">
                                      {appowner.email}
                                    </span>
                                  </span>
                                </span>
                              </td>

                              <td className="product-total-price">
                                <span className="product-price-wrapper">
                                  <span className="money fmont">
                                    <strong>
                                      <span className="font-xss">
                                        {appowner.phone}
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
                                        {appowner.city}
                                      </span>
                                    </strong>
                                  </span>
                                </span>
                              </td>

                              <td className="product-remove">
                                <a onClick={() => handleDelete(appowner._id)}>
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

export default Cart;
