import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

const Createpost = ({ userType, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const { showcreate, setShowCreate } = useState(false);

  const menuClass = isOpen ? "show" : "";

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3 ">
      <div className="d-flex justify-content-between">
        <a
          href={`/offer/${id}`}
          className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
        >
          <i className="feather-briefcase btn-round-md bg-primary-gradiant me-2"></i>
          Collaboration offers
        </a>
        <a
          href={`/review/${id}`}
          className="font-xssss fw-600 card-body p-0 d-flex align-items-center"
        >
          <i className="btn-round-sm font-xs ttext-blue-500 feather-edit me-2 bg-greylight"></i>
          Write a Review
        </a>
      </div>
    </div>
  );
};

export default Createpost;
