import React, { Component, useEffect, useState } from "react";

import axios from "axios";

const FilterAdmin = ({ title, onChange, search }) => {


  return (
    <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
      <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
        {title}
        <div className="pt-0 pb-0 ms-auto">
          <div className="search-form-2 ms-2">
            <input
              name="search"
              type="text"
              className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
              placeholder="Search here"
              value={search}
              onChange={onChange}
            />
          </div>
        </div>
      
      </h2>
    </div>
  );
};

export default FilterAdmin;