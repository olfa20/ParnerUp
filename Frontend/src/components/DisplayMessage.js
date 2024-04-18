import React, { useState, useContext } from "react";
import { AuthContext } from "../shared/authContext";

const DisplayMessage = ({ isOpen, message, onClose }) => {
  const auth = useContext(AuthContext);

  return (
    <>
      {isOpen && (
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999",
            boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.2)",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px" }}>{message}</p>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default DisplayMessage;
