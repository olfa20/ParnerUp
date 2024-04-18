import React, { Component, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import axios from "axios";

const Pagetitle = ({ getChats, title, setSearch, search }) => {
 
  const handleInputChange = (event) => {
    setSearch(event.target.value);
    //setTimeout(getChats, 1000);
  };

  return (
    <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
      <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
        {title}
        <div className="pt-0 pb-0 ms-auto">
          <div className="search-form-2 ms-2">
            {/* <button className="ti-search font-xss" type="submit"></button> */}
            <input
              name="search"
              type="text"
              className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
              placeholder="Search here."
              value={search}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <a
          href="/"
          className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"
        >
          <i className="feather-filter font-xss text-grey-500"></i>
        </a>
      </h2>
    </div>
  );
};

export default Pagetitle;