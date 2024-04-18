import React, { Component, Fragment, useEffect, useState } from "react";

import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { AuthContext } from "../shared/authContext";
import { useContext } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from "react-accessible-accordion";

const Advanced = () => {
  const auth = useContext(AuthContext);

  const [Advanceds, setAdvanceds] = useState([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAdvanced = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/advanced/getByUserType/${auth.userType}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setAdvanceds(result);
    } catch (err) {
      setError(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  useEffect(() => {
    if (auth.userId) {
      fetchAdvanced();
    }
  }, [auth.userId]);

  useEffect(() => {
    const searchAdvanced = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/advanced/userTypeandTitle/${search}/${auth.userType}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setAdvanceds(result.advanced);
      } catch (err) {
        setError(err);
      }
    };

    if (search) {
      searchAdvanced();
    } else {
      fetchAdvanced();
    }
  }, [search, auth.token]);

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div
                  className="card w-100 border-0 p-0 rounded-3 overflow-hidden bg-image-contain bg-image-center"
                  style={{
                    backgroundImage: `url("assets/images/help-bg.png")`,
                  }}
                >
                  <div
                    className="card-body p-md-5 p-4 text-center"
                    style={{ backgroundColor: "rgba(0,85,255,0.8)" }}
                  >
                    <h2 className="fw-700 display2-size text-white display2-md-size lh-2">
                      Welcome to the Partner Up Commuinity!
                    </h2>

                    <p className="font-xsss ps-lg-5 pe-lg-5 lh-28 text-grey-200">
                      Here we provide tips and advice for influencers and
                      companies to collaborate effectively on social media
                      platforms. As social media continues to grow in
                      popularity, so does the importance of influencer
                      marketing.{" "}
                    </p>
                    <div className="form-group w-lg-75 mt-4 border-light border p-1 bg-white rounded-3 ms-auto me-auto">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-group icon-input mb-0">
                            <i className="ti-search font-xs text-grey-400"></i>
                            <input
                              type="text"
                              className="style1-input border-0 ps-5 font-xsss mb-0 text-grey-500 fw-500 bg-transparent"
                              placeholder="Search anythings.."
                              value={search} // add this line to set the input value to the search term
                              onChange={handleSearch}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <a
                            href="helpbox"
                            className="w-100 d-block btn bg-current text-white font-xssss fw-600 ls-3 style1-input p-0 border-0 text-uppercase "
                          >
                            Search
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card w-100 border-0 shadow-none bg-transparent mt-5">
                  <Accordion
                    className="accodion-style--1 accordion"
                    preExpanded={"0"}
                  >
                    {Advanceds &&
                      Advanceds.map((advanced) => (
                        <AccordionItem
                          className="card shadow-xss"
                          key={advanced._id}
                        >
                          <AccordionItemHeading className="card-header">
                            <AccordionItemButton>
                              <h5 className="fw-600 pt-2 pb-2 mb-0">
                                {advanced.title}
                              </h5>
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel className="card-body">
                            <p>{advanced.description}</p>
                          </AccordionItemPanel>
                        </AccordionItem>
                      ))}
                  </Accordion>
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

export default Advanced;
