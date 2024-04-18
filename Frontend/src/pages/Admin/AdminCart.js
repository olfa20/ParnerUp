import React, { Component, Fragment, useEffect, useState } from "react";
import Leftnav from "../../components/Leftnav";
import Popupchat from "../../components/Popupchat";
import Header from "../../components/Header";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import axios from "axios";
import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";

const Cart = () => {
  const [admins, setAdmins] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5000`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const result = await response.json();

      setAdmins(result.users);
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
          `http://localhost:5000/adminByname/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setAdmins(result);
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

  const handleDelete = (adminId) => {
    setAdmins(admins.filter((a) => a._id !== adminId));
    axios
      .delete(`http://localhost:5000/${adminId}`)
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
        const response = await fetch(`http://localhost:5000/count`, {
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
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                      <div className="bg-pattern-div"></div>
                      <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                        Admins{" "}
                        <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block">
                          {count} Admin FOUND
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
                <Pagetitlegroup
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  value={search}
                  onChange={handleSearch}
                
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
                          
                            <th className="border-0 p-4 text-left">Name</th>
                            <th className="border-0 p-4">Email</th>
                            <th className="border-0 p-4">Phone</th>
                            <th className="border-0 p-4">City</th>

                            <th className="border-0 p-4">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((admin) => (
                            <tr key={admin._id}>
                              <td className="product-total-price">
                                <span className="product-price-wrapper">
                                  <span className="money fmont">
                                    <strong>
                                      <span className="font-xss">
                                        {admin.fname} {admin.lname}
                                      </span>
                                    </strong>
                                  </span>
                                </span>
                              </td>
                              <td className="product-p">
                                <span className="product-price-wrapper">
                                  <span className="money text-grey-500 fw-600 font-xsss">
                                    <span className="font-xsss">
                                      {admin.email}
                                    </span>
                                  </span>
                                </span>
                              </td>

                              <td className="product-total-price">
                                <span className="product-price-wrapper">
                                  <span className="money fmont">
                                    <strong>
                                      <span className="font-xss">
                                        {admin.phone}
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
                                        {admin.city}
                                      </span>
                                    </strong>
                                  </span>
                                </span>
                              </td>

                              <td className="product-remove">
                                <a onClick={() => handleDelete(admin._id)}>
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
