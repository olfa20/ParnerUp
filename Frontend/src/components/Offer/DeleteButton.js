import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const DeleteButton = ({ offerID, onDelete, setOffers, offers }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/offer/${offerID}`)
      .then((response) => {
        console.log(response);

        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button
        style={{
          backgroundColor: "#fff",
          fontSize: "15px",
          marginLeft: "-32px",
          border: "none",
          color: "#B22222",
          cursor: "pointer",
        }}
        className="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1"
        onClick={handleShow}
      >
        Delete
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteButton;
