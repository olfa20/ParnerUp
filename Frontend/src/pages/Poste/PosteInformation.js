import React, { Component, Fragment, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Leftnav from "../../components/Leftnav";
import Rightchat from "../../components/Rightchat";
import Popupchat from "../../components/Popupchat";
import Appfooter from "../../components/Appfooter";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";

const PosteInformation = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    category: "",
    hashtags: "",
    location: "",
    media: "",
  });
  const { postId } = useParams();
  const auth = useContext(AuthContext);
  const [oldImg, setOldImg] = useState();

  console.log("hereee");
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/poste/poste/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);

        if (isMounted) {
          setFormdata(result);
          setOldImg(
            result.media
              ? "http://localhost:5000/" + result.media
              : "https://via.placeholder.com/300x300.png"
          );
        }
      } catch (err) {
        setError(err);
      }
    };

    if (postId) {
      fetchPosts();
    }
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formdata.description) {
      setError(true);
      setMessage("description is required");
    } else if (!formdata.title) {
      setError(true);
      setMessage("title is required");
    } else {
      let formDataUp = new FormData();

      formDataUp.append("description", formdata.description);
      formDataUp.append("title", formdata.title);
      formDataUp.append("location", formdata.location);
      formDataUp.append("category", formdata.category);
      formDataUp.append("hashtags", formdata.hashtags);
      formDataUp.append("media", formdata.media);

      try {
        const response = await fetch(`http://localhost:5000/poste/${postId}`, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formDataUp,
        });

        const result = await response.json();
        if (!response.ok) {
          setError(true);
          setMessage(result.message);
          throw new Error(result.message);
        }
        history.push("/userpage");
      } catch (error) {
        console.log(error);
        setError(true);
        setMessage(error);
      }
    }

    //;
  };

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.currentTarget.files && event.currentTarget.files.length === 1) {
      pickedFile = event.currentTarget.files[0];
      setFormdata({
        ...formdata,
        [event.currentTarget.name]: pickedFile,
      });
      setOldImg(URL.createObjectURL(event.currentTarget.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fragment>
        <Header />
        {/* <Leftnav />
        <Rightchat /> */}

        <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
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
                        <span>Post Details</span>
                      )}
                    </h4>
                  </div>
                  <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                    <div className="row justify-content-center">
                      <div className="col-lg-4 text-center">
                        <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                          <img
                            src={oldImg}
                            alt="avater"
                            className="shadow-sm rounded-3 w-100"
                          />
                        </figure>
                        <h2 className="fw-700 font-sm text-grey-900 mt-3"></h2>
                        <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4"></h4>
                      </div>
                    </div>

                    <form>
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

                        {/* <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Category
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="category"
                              value={formdata.category}
                              onChange={handleChange}
                            />
                          </div>
                        </div> */}
                      </div>

                      <div className="row">
                        {/* <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              hashtags
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="hashtags"
                              value={formdata.hashtags}
                              onChange={handleChange}
                            />
                          </div>
                        </div> */}

                        {/* <div className="col-lg-6 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Link
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div> */}
                      </div>

                      <div className="row">
                        <div className="col-lg-12 mb-3">
                          {/* <div className="form-group">
                         <label className="mont-font fw-600 font-xsss mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="country"
                            />
                          </div> */}
                        </div>

                        {/* <div className="col-lg-12 mb-3">
                          <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Address 
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="location"
                              value={formdata.location}
                              onChange={handleChange}
                            />
                          </div>
                        </div> */}
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          {/* <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Twon / City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                            />
                          </div> */}
                        </div>

                        <div className="col-lg-6 mb-3">
                          {/* <div className="form-group">
                            <label className="mont-font fw-600 font-xsss mb-2">
                              Postcode
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="postcode"
                            />
                          </div> */}
                        </div>

                        <div className="col-lg-12 mb-3">
                          <div className="card mt-3 border-0">
                            <div className="card-body d-flex justify-content-between align-items-end p-0">
                              <div className="form-group mb-0 w-100">
                                <input
                                  type="file"
                                  name="media"
                                  id="file"
                                  className="input-file"
                                  onChange={pickedHandler}
                                />
                                <label
                                  htmlFor="file"
                                  className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed"
                                >
                                  <i className="ti-cloud-down large-icon me-3 d-block"></i>
                                  <span className="js-fileName">
                                    Drag and drop or click to replace
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    {/* <div className="col-lg-12">
                      <button
                        
                        className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                      >
                        Save
                      </button>
                    </div> */}
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
export default PosteInformation;
