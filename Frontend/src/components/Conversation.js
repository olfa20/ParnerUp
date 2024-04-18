import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Conversation = ({
  data,
  currentUserId,
  createdAt,
  chatMessage,
  createdAtt,
  sender,
  receiver,
}) => {
  console.log("🚀 ~ file: Conversation.js:13 ~ chatMessage:", chatMessage);

  const userData = sender._id.toString() === currentUserId ? receiver : sender;

  return (
    <>
      <div>
        <ul className="email-message">
          <li>
            <Link
              to={`/defaultmessage/${userData._id}`}
              className={`rounded-3 `}
            >
              <div className="form-check mt-1">
                <label
                  className="text-grey-500 font-xssss"
                  htmlFor="blankCheckbox1"
                ></label>
              </div>
              <div
                className="email-user"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span className="btn-round-xss ms-0 bg-success me-2"></span>

                <img
                  src={
                    userData?.profileImage
                      ? `http://localhost:5000/${userData?.profileImage}`
                      : "https://via.placeholder.com/300x300.png"
                  }
                  alt=""
                  className="w35 me-2 rounded-circle"
                />
                <div>
                  <h6
                    style={{ marginLeft: "30px" }}
                    className="font-xssss text-grey-900 text-grey-900 mb-0 mt-0 fw-700"
                  >
                    {userData.userType === "appowner"
                      ? userData.company
                      : userData.fname + " " + userData.lname}
                  </h6>
                  <span style={{ marginLeft: "30px" }}>
                    {chatMessage.match(/\.(jpeg|jpg|gif|png)$/)
                      ? "image"
                      : chatMessage}
                  </span>{" "}
                </div>
              </div>

              <div
                className="email-time text-grey-500 fw-600"
                style={{ marginRight: "-700px" }}
              >
                {createdAt}
              </div>
              <div className="email-time text-grey-500 fw-600">
                {createdAtt}
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <hr style={{ width: "100 %", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
