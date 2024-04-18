import React, {
  Component,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";
import axios from "axios";

const ResultSearch = () => {
  const [users, setUsers] = useState([]);

  let { name } = useParams();

  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/influencer/getUserByName/${name}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );

        const result = await response.json();
        setUsers(result);
        console.log(result);

        // Set isCurrentUser to true if the logged-in user's ID matches the ID in the URL
      } catch (err) {
        setError(err);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  return (
    <Fragment>
      <Header />

      <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-lg-5 p-4 w-100 border-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="mb-4 font-xxl fw-700 mont-font mb-lg-5 mb-4 font-md-xs">
                        Results
                      </h4>
                      <>
                        {users &&
                          users.map((user) => (
                            <ul className="list-inline mb-4">
                              <li
                                key={user._id}
                                className="list-inline-item d-block border-bottom me-0"
                              >
                                {user.userType === "influencer" ? (
                                  <Link
                                    to={`/profile/${user._id}`}
                                    className="pt-2 pb-2 d-flex align-items-center"
                                  >
                                    {/* <i className="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"></i>{" "} */}
                                    <img
                                      src={
                                        user.profileImage
                                          ? "http://localhost:5000/" +
                                            user.profileImage
                                          : "https://via.placeholder.com/300x300.png"
                                      }
                                      alt="credit card"
                                      className="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"
                                      width="24"
                                      height="24"
                                    />

                                    <h4 className="fw-600 font-xsss mb-0 mt-0">
                                      {user.lname} {user.fname}
                                    </h4>
                                    <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/profileappowner/${user._id}`}
                                    className="pt-2 pb-2 d-flex align-items-center"
                                  >
                                    {/* <i className="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"></i>{" "} */}
                                    <img
                                      src={
                                        user.profileImage
                                          ? "http://localhost:5000/" +
                                            user.profileImage
                                          : "https://via.placeholder.com/300x300.png"
                                      }
                                      alt="credit card"
                                      className="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"
                                      width="24"
                                      height="24"
                                    />
                                    <h4 className="fw-600 font-xsss mb-0 mt-0">
                                      {user.lname} {user.fname}
                                    </h4>
                                    <i className="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                                  </Link>
                                )}
                              </li>
                            </ul>
                          ))}
                      </>
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

export default ResultSearch;
