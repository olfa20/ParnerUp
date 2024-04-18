import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import Load from "../components/Load";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import FilterInfluencer from "../components/FilterInfluencer";
import { faU } from "@fortawesome/free-solid-svg-icons";

const FilterInfluencers = () => {
  const [count, setCount] = useState(0);
  const [influencers, setInfluencers] = useState([]);
  const [contents, setContents] = useState([]);
  const [publics, setPublics] = useState([]);
  const [audienceAges, setAudienceAges] = useState([]);

  const [city, setCity] = useState();
  const [fcontent, setFcontent] = useState(null);
  const [fpublic, setFpublic] = useState(null);
  const [faudience, setFaudience] = useState(null);
  const [search, setSearch] = useState("");

  const [error, setError] = useState(false);
  const auth = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/influencer`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const result = await response.json();

      setInfluencers(result.users);
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
          `http://localhost:5000/getuserbyname/${search}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setInfluencers(result);
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

  useEffect(() => {
    const fecthContent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/content/contents`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setContents(result.contents);
      } catch (err) {
        setError(err);
      }
    };
    fecthContent();
  }, [auth.token]);
  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public/publics`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setPublics(result.publics);
      } catch (err) {
        setError(err);
      }
    };
    fetchPublic();
  }, [auth.token]);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/audience/audiences`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();
        setAudienceAges(result.audiences);
      } catch (err) {
        setError(err);
      }
    };
    fetchAudience();
  }, [auth.token]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/influencer/count`, {
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

  useEffect(() => {
    const sendRequest = async () => {
      let filter = null;
      if (city && !fcontent && fpublic && faudience) {
        filter =
          `http://localhost:5000/offer/filter/publicaudienceandcity/` +
          fpublic +
          "/" +
          faudience +
          "/" +
          city;
      } else if (!city && fcontent && fpublic && faudience) {
        filter =
          `http://localhost:5000/influencer/filter/publicaudienceandcontent/` +
          fpublic +
          "/" +
          faudience +
          "/" +
          fcontent;
      } else if (!city && !fcontent && fpublic && faudience) {
        filter =
          `http://localhost:5000/influencer/filter/publicandaudience/` +
          fpublic +
          "/" +
          faudience;
      } else if (!city && fcontent && !fpublic && !faudience) {
        filter = `http://localhost:5000/influencer/filter/content/` + fcontent;
      } else if (city && !fcontent && !fpublic && !faudience) {
        filter = `http://localhost:5000/influencer/filter/city/` + city;
      } else if (!city && !fcontent && !fpublic && faudience) {
        filter =
          `http://localhost:5000/influencer/filter/audience/` + faudience;
      } else if (!city && fcontent && fpublic && !faudience) {
        filter =
          `http://localhost:5000/influencer/filter/contentandpublic/` +
          fcontent +
          "/" +
          fpublic;
      } else if (!city && fcontent && !fpublic && faudience) {
        filter =
          `http://localhost:5000/influencer/filter/contentandaudience/` +
          fcontent +
          "/" +
          faudience;
      } else if (city && fcontent && !fpublic && !faudience) {
        filter =
          `http://localhost:5000/influencer/filter/cityandcontent/` +
          fcontent +
          "/" +
          city;
      } else if (city && fcontent && fpublic && faudience) {
        filter =
          `http://localhost:5000/influencer/filter/all/` +
          fpublic +
          "/" +
          faudience +
          "/" +
          fcontent +
          "/" +
          city;
      } /* else {
        filter = `${process.env.REACT_APP_BACKEND_URL}book`;
      } */ else if (!city && !fcontent && fpublic && !faudience) {
        filter = `http://localhost:5000/influencer/filter/public/` + fpublic;
      }
      if (filter) {
        try {
          //fetch
          const response = await fetch(filter);
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          setInfluencers(responseData.users);
        } catch (err) {
          console.log(err);
        }
      }
    };
    sendRequest();
  }, [fpublic, faudience, fcontent, city]);

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
                  <div className="col-xl-12 col-xxl-12 col-lg-12" style={{marginLeft:"10px"}}>
                    <div className="row">
                      <div className="col-lg-12" style={{ marginLeft: "10px" }}>
                        <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                          <div className="bg-pattern-div"></div>
                          <h2
                            className="display2-md-size fw-700 text-white mb-0 mt-0"
                            style={{ fontSize: "30px" }}
                          >
                            {count} Influencers{" "}
                          </h2>
                        </div>
                      </div>

                      <div
                        className="row ps-2 pe-1"
                        style={{ marginLeft: "8px" }}
                      >
                        {influencers.map((influencer) => (
                          <div
                            key={influencer._id}
                            className="col-md-6 col-sm-6 pe-2 ps-2"
                          >
                            <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2">
                              <div
                                className="card-body position-relative h100 bg-image-cover bg-image-center"
                                style={{
                                  backgroundImage: `url(${
                                    "http://localhost:5000/" +
                                      influencer.couvertureImage?.replace(
                                        /\\/g,
                                        "/"
                                      ) ||
                                    "https://via.placeholder.com/1200x450.png"
                                  })`,
                                }}
                              ></div>
                              <div className="card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
                                <figure
                                  className="avatar position-absolute w75 z-index-1 left-15"
                                  style={{ marginTop: `-40px` }}
                                >
                                  <img
                                    src={
                                      influencer.profileImage
                                        ? "http://localhost:5000/" +
                                          influencer.profileImage
                                        : "https://via.placeholder.com/300x300.png"
                                    }
                                    alt="avater"
                                    className="float-right p-1 bg-white rounded-circle w-100 "
                                  />
                                </figure>
                                <div className="clearfix"></div>
                                <h4 className="fw-700 font-xsss mt-3 mb-1">
                                  {influencer.fname} {influencer.lname}
                                </h4>
                                <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3">
                                  {influencer.email}
                                </p>
                                <span className="position-absolute right-15 top-0 d-flex align-items-center">
                                  <a
                                    href={`/profile/${influencer._id}`}
                                    className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white"
                                  >
                                    Profile
                                  </a>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Load />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-xxl-3 col-lg-3 theme-dark-bg">
          <FilterInfluencer
            title="Group"
            contents={contents}
            setContents={setContents}
            publics={publics}
            setPublics={setPublics}
            audienceAges={audienceAges}
            setAudienceAges={setAudienceAges}
            city={city}
            fcontent={fcontent}
            setCity={setCity}
            setFcontent={setFcontent}
            setFaudience={setFaudience}
            setFpublic={setFpublic}
            fetchUsers={fetchUsers}
          />
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default FilterInfluencers;
