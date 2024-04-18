import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import DisplayComment from "../components/Displaycomment";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import LikesModal from "./LikesModal";

const Postview = ({
  post,
  user,
  createdAt,
  createdAtt,
  des,
  avater,
  postimage,
  postvideo,
  id,
  fname,
  postId,
  onDelete,
  postphoto,
  hashtags,
  category,
  title,
  idsearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const auth = useContext(AuthContext);

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (id) {
      setShow(false);
    }
  }, [id, auth.userId]);

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
            postimage && postimage
                ? "http://localhost:5000/" + postimage
                : "https://via.placeholder.com/300x300.png"
            }
            alt="avater"
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        { post.created_by?.userType === "influencer" && (
          <Link to={`/profile/${post.created_by._id}`}>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          {" "}
          {fname} {user}{" "}
        
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {" "}
            {createdAt} {createdAtt}
          </span>
        </h4>
        </Link>
        )}
        { post.created_by?.userType === "appowner" && (
          <Link to={`/profileappowner/${post.created_by._id}`}>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          {" "}
          {fname} {user}{" "}
        
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {" "}
            {createdAt} {createdAtt}
          </span>
        </h4>
        </Link>
        )}
        
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
      <p className="fw-500 text-grey-900 lh-26 font-xsss w-100 mb-2">
          {title}
        </p>
        <p className="fw-500 text-grey-500 lh-26 font-xsss w-100 mb-2">
          {des}{" "}
        </p>
        {/* <p className="fw-500 text-grey-500 lh-26 font-xssss w-100 mb-2">
          {hashtags}{" "}
          
        </p> */}
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
          <a
            className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
            style={{ marginLeft: "60px" }}
          >
            <LikesModal postId={postId} />
          </a>
        </div>

        <a
          className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
          style={{ marginLeft: "60px" }}
        >
          <DisplayComment postId={postId} />
        </a>

        
      </div>
    </div>
  );
};

export default Postview;
