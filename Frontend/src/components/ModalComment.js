import React, { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../shared/authContext";

const ModalComment = ({ postId}) => {
  const auth = useContext(AuthContext);

  const history = useHistory();
  const [error, setError] = useState(false);
  const [formdata, setFormdata] = useState({
    comment: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
      
        const response = await fetch(
          `http://localhost:5000/notificationprofile/${auth.userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comment: formdata.comment,
              postId: postId,
            }),
          }
        );
        const result = await response.json();
        console.log(result);
     
        
      } catch (error) {
        setError(error.message);
        console.log(error)
      }
    }
  };
  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    
    <>
    <button
      style={{
        backgroundColor: "transparent",
        fontSize: "15x",
        marginLeft: "-32px",
        border: "none",
      }}
      className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
      onClick={handleShow}
    >
      Comment
    </button>
    <form onSubmit={submitHandler}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Add Comment </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-lg-12 mb-3">
            <div className="form-group">
              <label className="mont-font fw-600 font-xsss mb-2">
                Comment
              </label>
              <textarea
                type="text"
                className="form-control"
                name="comment"
                value={formdata.comment}
                onChange={handleChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="secondary"onClick={submitHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  </>
);
};

export default ModalComment;
