import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import { Fragment } from "react";
import Rightchat from "../components/Rightchat";
import { AuthContext } from "../shared/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Note = () => {
  const [Notes, setNotes] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const auth = useContext(AuthContext);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [fcategoryNote, setFcategoryNote] = useState(null);
  const [notifications,setNotifications] = useState([])

  useEffect(() => {
    const fetchNoteCategory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/categorynote/all`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setCategoryNotes(result.categoriesNote);
      } catch (err) {
        setError(err);
      }
    };
    fetchNoteCategory();
  }, [auth.token]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/note/${auth.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();
      console.log(result,"note");
      setNotes(result);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (auth.userId) {
      fetchNotes();
    }
  }, [auth.userId]);

  const handleDelete = (noteId) => {
    setNotes(Notes.filter((n) => n._id !== noteId));
    axios
      .delete(`http://localhost:5000/note/${noteId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    const sendRequest = async () => {
      let filter = null;
      if (fcategoryNote && auth.userId) {
        filter =
          `http://localhost:5000/note/filter/categorynote/` +
          fcategoryNote +
          "/" +
          auth.userId;
      }

      if (filter) {
        try {
          //fetch
          const response = await fetch(filter);
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          setNotes(responseData.notes);
        } catch (err) {
          console.log(err);
        }
      }
    };
    sendRequest();
  }, [fcategoryNote, auth.userId]);

  const reset = () => {
    setFcategoryNote(null);
    fetchNotes();
  };





  return (
    <Fragment>
      <Header />
    
      <>
        <div className="main-content bg-white right-chat-active theme-dark-bg">
          <div className="middle-sidebar-bottom theme-dark-bg">
            <div className="middle-sidebar-left theme-dark-bg">
              <div className="page-content container note-has-grid">
                <ul className="nav nav-pills p-3 bg-white mb-3 rounded-pill align-items-center">
                  <li className="nav-item">
                    <a
                      href="javascript:void(0)"
                      className="nav-link rounded-pill note-link d-flex align-items-center px-2 px-md-3 mr-0 mr-md-2 active"
                      id="all-category"
                      onClick={reset}
                    >
                      <i className="icon-layers mr-1"></i>
                      <span className="d-none d-md-block">All Notes</span>
                    </a>
                  </li>
                  {categoryNotes &&
                    categoryNotes.map((category) => (
                      <li className="nav-item" key={category._id}>
                        <Link
                          to="#"
                          onClick={() => setFcategoryNote(category._id)}
                        >
                          <a
                            href="javascript:void(0)"
                            className="nav-link rounded-pill note-link d-flex align-items-center px-2 px-md-3 mr-0 mr-md-2"
                          >
                            <i className={`icon-${category.icon} mr-1`}></i>
                            <span className="d-none d-md-block">
                              {category.name}
                            </span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  <li className="nav-item ml-auto">
                    <Link to="/createnote">
                      <button
                        className="p-2 lh-20 w150 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
                        style={{ marginLeft: "330px", border: "none" }}
                      >
                        Add Notes
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="container">
                <div className="row">
                  {Notes &&
                    Notes.map((note, index) => (
                      <div className="col-md-4 mb-4" key={index}>
                        <div
                          className="card card-body"
                          style={{ height: "250px", borderRadius: "10px" }}
                        >
                          <span className="side-stick"></span>
                          <h5
                            className="note-title text-truncate w-75 mb-0"
                            data-noteheading="Book a Ticket for Movie"
                          >
                            {note.title}{" "}
                            <i className="point fa fa-circle ml-1 font-10">
                              <FontAwesomeIcon icon={faCircle} />
                            </i>
                          </h5>
                          <p className="note-date font-12 text-muted">
                            {new Date(note.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <div className="note-content">
                            <p
                              className="note-inner-content text-muted"
                              data-notecontent="Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis."
                            >
                              {note.description}
                            </p>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="mr-1">
                              <i className="fa fa-trash remove-note"></i>
                            </span>
                          </div>
                        </div>
                        <div style={{ marginLeft: "210px" }}>
                          <Link to={`/editnote/${note._id}`}>
                            <button className="btn btn-sm btn-link mx-1">
                              <FaEdit />
                            </button>
                          </Link>
                          <button
                            className="btn btn-sm btn-link mx-1"
                            onClick={() => handleDelete(note._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
};
export default Note;
