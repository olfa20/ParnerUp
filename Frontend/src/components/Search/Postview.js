import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "../DeleteButton";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
const PostviewApp = ({
 
  createdAt,
  createdAtt,
  des,
  avater,
  postimage,
  postvideo,
  id,
  idsearch,
  company,
  postId,
  onDelete,
  postphoto,
  hashtags,
  category,
  title,
}) => {
  const auth = useContext(AuthContext);
  

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleActive = () => setIsActive(!isActive);

  const menuClass = `${isOpen ? " show" : ""}`;
  const emojiClass = `${isActive ? " active" : ""}`;
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <img
            src={
              postimage
                ? "http://localhost:5000/" + postimage
                : "https://via.placeholder.com/300x300.png"
            }
            alt="avater"
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          {" "}
          {company}{" "}
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {" "}
            {createdAt} {createdAtt}
          </span>
        </h4>
      </div>

      {postvideo ? (
        <div className="card-body p-0 mb-3 rounded-3 overflow-hidden uttam-die">
          <a href="/defaultvideo" className="video-btn">
            <video autoPlay loop className="float-right w-100">
              <source src={`assets/images/${postvideo}`} type="video/mp4" />
            </video>
          </a>
        </div>
      ) : (
        ""
      )}
      <div className="card-body p-0 me-lg-5">
        <p className="fw-500 text-grey-500 lh-26 font-xssss w-100 mb-2">
          {title}
          {/* <a href="/defaultvideo" className="fw-600 text-primary ms-2">
              See more
            </a> */}
        </p>
        <p className="fw-500 text-grey-500 lh-26 font-xssss w-100 mb-2">
          {des}{" "}
          {/* <a href="/defaultvideo" className="fw-600 text-primary ms-2">
              See more
            </a> */}
        </p>
        <p className="fw-500 text-grey-500 lh-26 font-xssss w-100 mb-2">
          {hashtags}{" "}
          {/* <a href="/defaultvideo" className="fw-600 text-primary ms-2">
              See more
            </a> */}
        </p>
      </div>
      {postphoto ? (
        <div className="card-body d-block p-0 mb-3">
          <div className="row ps-2 pe-2">
            {postphoto.map((photo) => (
              <div key={photo._id} className="col-sm-12 p-1">
                <img src={"http://localhost:5000/" + photo} alt="post" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="card-body d-flex p-0">
        <div
          className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
          onClick={toggleActive}
        >
          <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{" "}
          <i className="feather-heart text-white bg-red-gradiant me-2 btn-round-xs font-xss"></i>
          2.8K Like
        </div>
        <div className={`emoji-wrap pointer ${emojiClass}`}>
          <ul className="emojis list-inline mb-0">
            <li className="emoji list-inline-item">
              <i className="em em---1"></i>{" "}
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-angry"></i>
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-anguished"></i>{" "}
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-astonished"></i>{" "}
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-blush"></i>
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-clap"></i>
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-cry"></i>
            </li>
            <li className="emoji list-inline-item">
              <i className="em em-full_moon_with_face"></i>
            </li>
          </ul>
        </div>
        <a
          href="/defaultvideo"
          className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
        >
          <i className="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i>
          <span className="d-none-xss">22 Comment</span>
        </a>

        {/* <DeleteButton postId={postId} onDelete={onDelete} /> */}
        <div
          className={`pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss ${menuClass}`}
          id={`dropdownMenu${id}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={toggleOpen}
        >
          <i className="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i>
          <span className="d-none-xs"></span>
        </div>
        <div
          className={`dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg right-0 ${menuClass}`}
          aria-labelledby={`dropdownMenu${id}`}
        >
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2 btn-group-vertical">
              <Link to={`/postinformation/${postId}`}>
                
                <li className="me-1">
                  <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-4 pointer">
                    <span
                      className="d-block fw-500 mt-1 lh-3 text-grey-500 text-lg-start"
                      style={{ fontSize: "14px" }}
                    >
                      Edit Post
                    </span>
                  </h4>
                </li>
               
              </Link>
              <li className="me-1">
                <DeleteButton postId={postId} onDelete={onDelete} />
              </li>
            </ul>
          </div>
          <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-4 pointer">
            <span
              className="d-block fw-500 mt-1 lh-3 text-grey-500 text-lg-start"
              style={{ fontSize: "14px" }}
            >
              Copy Link
            </span>
          </h4>
          <i className="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
          <input
            type="text"
            placeholder="https://socia.be/1rGxjoJKVF0"
            className="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg"
          />
        </div>
      </div>
    </div>
  );
};

export default PostviewApp;
