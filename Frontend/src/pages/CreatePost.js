import React, { useState } from "react";
import { Fragment } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import { Link, useHistory } from "react-router-dom";
import Popupchat from "../components/Popupchat";
import Appfooter from "../components/Appfooter";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
const CreatePost = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const [oldImg, setOldImg] = useState();
  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    category: "",
    hashtags: "",
    location: "",
    created_by: auth.userId,
    media: null,
    created_by_type: auth.userType,
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    try {
      const formData = new FormData();
      formData.append("title", formdata.title);
      formData.append("description", formdata.description);
      formData.append("category", formdata.category);
      formData.append("hashtags", formdata.hashtags);
      formData.append("location", formdata.location);
      formData.append("created_by", formdata.created_by);
      formData.append("media", formdata.media);

      const response = await fetch("http://localhost:5000/poste/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(true);
        setMessage(responseData.message);
        throw new Error(responseData.message);
      }

      history.push("/userpage");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
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
    <form onSubmit={submitHandler}>
      <Fragment>
        <Header />

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
                      Post Details
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
                      <div className="row" style={{ marginTop: "-30px" }}>
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
                      </div>

                      <div className="row">
                        <div
                          className="col-lg-12 mb-3"
                          style={{ marginTop: "-20px" }}
                        >
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

                    <div className="col-lg-12" style={{ marginTop: "-10px" }}>
                      <button
                        type="submit"
                        className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                        style={{ height: "50px" }}
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

export default CreatePost;
