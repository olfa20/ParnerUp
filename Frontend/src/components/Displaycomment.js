import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../shared/authContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./DisplayComments.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const CommentModal = ({ postId }) => {
  dayjs.extend(relativeTime);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [editComment, setEditComment] = useState({ id: null, value: "" });
  const [comment, setComment] = useState([]);
  const [error, setError] = useState(false);

  const auth = useContext(AuthContext);
  const [formdata, setFormdata] = useState({
    comment: "",
  });
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        //fetch
        const response = await fetch(
          `http://localhost:5000/comment/all/${postId}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setComments(responseData.comment);
      } catch (err) {
        console.log(err);
      }
    };

    sendRequest();
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        const response = await fetch(
          `http://localhost:5000/comment/${auth.userId}`,
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

        setComments([...comments, result]);
        setFormdata({ comment: "" });
        console.log(result);
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
  };
  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId));
    axios
      .delete(`http://localhost:5000/comment/${commentId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateComment = async (commentId, updatedComment) => {
    try {
      const response = await fetch(
        `http://localhost:5000/comment/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: updatedComment,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: updatedComment }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comment/count/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setCount(result.commentCount);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

 

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
        {count}Comment
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="d-flex">
                <img
                  src={
                    comment.image
                      ? "http://localhost:5000/" + comment.image
                      : "https://via.placeholder.com/300x300.png"
                  }
                  alt={comment.fname + " " + comment.lname}
                  className="me-2 rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />

                <div>
                  <h6>
                    {comment.fname} {comment.lname}
                  </h6>
                  <p>{comment.comment}</p>
                  <small className="text-muted" style={{ marginTop: "5px" }}>
                    {dayjs(comment.createdAt).fromNow()}
                  </small>

                  {auth.userId === comment.user && (
                    <div className="mt-2">
                      {editComment.id === comment.id ? (
                        <div>
                          <Form.Control
                            type="text"
                            placeholder="Edit your comment"
                            value={editComment.value}
                            onChange={(e) =>
                              setEditComment({
                                ...editComment,
                                value: e.target.value,
                              })
                            }
                          />
                          <Button
                            onClick={() => {
                              updateComment(editComment.id, editComment.value);
                              setEditComment({ id: null, value: "" });
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-primary me-2 pointer">
                            <FaEdit
                              onClick={() =>
                                setEditComment({
                                  id: comment.id,
                                  value: comment.comment,
                                })
                              }
                            />
                          </span>

                          <span
                            className="text-danger pointer"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <FaTrash />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Add a comment..."
                name="comment"
                value={formdata.comment}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              type="submit"
              className="p-2 lh-20 w150 bg-primary-gradiant me-2 text-white text-center font-xsss fw-700 ls-1 rounded-xl"
            >
              Add Comment
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xsss fw-600 ls-1 rounded-xl"
            style={{ border: "none" }}
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CommentModal;
