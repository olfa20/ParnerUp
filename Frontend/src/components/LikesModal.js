import React, { useState, useEffect, useContext } from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../shared/authContext";

const LikesModal = ({ postId }) => {
  const [likes, setLikes] = useState([]);
  const [show, setShow] = useState(false);
  const auth = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        //fetch
        const response = await fetch(
          `http://localhost:5000/like/all/${postId}`
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData, postId);
        setLikes(responseData.like);
      } catch (err) {
        console.log(err);
      }
    };

    sendRequest();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        const response = await fetch(
          `http://localhost:5000/like/${postId}/${auth.userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        if (response.status === 201) {
          setCount(count + 1);
        } else if (response.status === 200) {
          setCount(count - 1);
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/like/count/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setCount(result.likeCount);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <i
        className="feather-heart text-white bg-red-gradiant me-2 btn-round-xs font-xss"
        onClick={handleShow}
        style={{ marginLeft: "-35px" }}
      ></i>
      <button
        style={{
          backgroundColor: "transparent",
          fontSize: "15x",

          border: "none",
        }}
        className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
        onClick={submitHandler}
      >
        {" "}
        {count} like{" "}
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {likes &&
              likes.map((like) => (
                <ListGroup.Item key={like._id}>
                  <img
                    src={
                      like.image
                        ? "http://localhost:5000/" + like.image
                        : "https://via.placeholder.com/300x300.png"
                    }
                    alt={`${like.fname} ${like.lname}`}
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                  {like.fname} {like.lname}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LikesModal;
