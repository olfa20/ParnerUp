import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const DeleteButton = ({ postId ,onDelete}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  
  const handleDelete = () => {
 
    axios
      .delete(`http://localhost:5000/poste/${postId}`)
      .then((response) => {
        // handle success
        console.log(response);
        onDelete(postId); 
        handleClose();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  return (
    <>
      <button style={{backgroundColor:"white", fontSize:"15x" , marginLeft:"-32px", border: "none"}} 
       className="d-block fw-500 mt-1 lh-3 text-grey-500 text-lg-start" onClick={handleShow}>
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
