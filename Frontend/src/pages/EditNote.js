import React, { Component, Fragment, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "../components/Header";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import Rightchat from "../components/Rightchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";

const EditNote = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const [categoryNotes, setCategoryNotes] = useState([]);

  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    categoryNote: "",
    createdAt: "",
  });
  const { noteId } = useParams();
  const auth = useContext(AuthContext);

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

  useEffect(() => {
    let isMounted = true;
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/note/note/${noteId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        if (isMounted) {
          setFormdata({
            title: result.title,
            description: result.description,
            categoryNote: result.categoryNote,
            createdAt: result.createdAt.substring(0, 10), // extract the date part only
          });
        }
      } catch (err) {
        setError(err);
      }
    };

    if (noteId) {
      fetchNote();
    }
    return () => {
      isMounted = false;
    };
  }, [noteId, auth.token]);

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formdata.title) {
      setError(true);
      setMessage("title is required");
    } else if (!formdata.description) {
      setError(true);
      setMessage("description is required");
    } else {
      try {
        const response = await fetch(`http://localhost:5000/note/${noteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            title: formdata.title,
            description: formdata.description,
            created_by: auth.userId,
            createdAt: formdata.createdAt,
          }),
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        history.push("/note");
      } catch (err) {
        console.log(err);
        setError(true);
        setMessage(err.message);
      }
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Fragment>
        <Header />

        <div
          className="main-content bg-lightblue theme-dark-bg right-chat-active"
          style={{ height: "720px" }}
        >
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left">
              <div className="middle-wrap">
                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                  <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                    <Link to="/defaultsettings" className="d-inline-block mt-2">
                      <i className="ti-arrow-left font-sm text-white"></i>
                    </Link>
                    <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                      {error ? (
                        <span style={{ color: "red" }}>{message}</span>
                      ) : (
                        <span>Note Details</span>
                      )}
                    </h4>
                  </div>
                  <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                    <div className="row justify-content-center">
                      <div className="col-lg-4 text-center">
                        <h2 className="fw-700 font-sm text-grey-900 mt-3"></h2>
                        <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4"></h4>
                      </div>
                    </div>

                    <form>
                      <div className="row">
                        <div className="row">
                          <div className="col-lg-12 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formdata.title}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Description
                          </label>
                          <textarea
                            className="form-control mb-0 p-3 h100 bg-greylight lh-16"
                            rows="5"
                            placeholder="Write your message..."
                            name="description"
                            value={formdata.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Category
                            </label>
                            <input
                              name="categoryNote"
                              required=""
                              onChange={handleChange}
                              className="form-control"
                              type="text"
                              value={formdata.categoryNote?.name}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="createdAt"
                            value={formdata.createdAt}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </form>

                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                      >
                        save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Popupchat />
        <Appfooter />
      </Fragment>
    </form>
  );
};
export default EditNote;
