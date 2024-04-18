import React, { Fragment, useState, useContext } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import { Link } from "react-router-dom";
import Popupchat from "../components/Popupchat";
import Appfooter from "../components/Appfooter";
import { AuthContext } from "../shared/authContext";
import { useHistory } from "react-router-dom";
import DisplayMessage from "../components/DisplayMessage";

const SignaleProblem = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const auth = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [oldImg, setOldImg] = useState();

  const [formdata, setFormdata] = useState({
    media: null,
    message: "",
  });
  const history = useHistory();
  const [message, setMessage] = useState();

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
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

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    try {
      const formData = new FormData();

      formData.append("message", formdata.message);

      formData.append("media", formdata.media);

      const response = await fetch(
        `http://localhost:5000/problem/${auth.userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        setShowModal(true);
        setModalMessage("Your message has been sent successfully!");
      } else {
        setShowModal(true);
        setModalMessage(responseData.message);
      }
    } catch (error) {
      setError(error.message);
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
                  </div>
                  <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                    <div className="row justify-content-center">
                      <div className="col-lg-4 text-center">
                        <h2 className="fw-700 font-sm text-grey-900 mt-3">
                          Report a problem
                        </h2>
                        <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4"></h4>
                        <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                          <img
                            src={oldImg}
                            alt="avater"
                            className="shadow-sm rounded-3 w-100"
                          />
                        </figure>
                      </div>
                    </div>

                    <form>
                      <div className="row">
                        <div className="col-lg-12 mb-3">
                          <label className="mont-font fw-600 font-xsss mb-2 text-dark">
                            Message
                          </label>
                          <textarea
                            className="form-control mb-0 p-3 h100 bg-greylight lh-16"
                            rows="5"
                            placeholder="Write your message..."
                            name="message"
                            value={formdata.message}
                            onChange={handleChange}
                          ></textarea>
                        </div>
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
                    </form>
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                      >
                        Save
                      </button>
                      <DisplayMessage
                        isOpen={showModal}
                        message={modalMessage}
                        onClose={handleCloseModal}
                        onChange={pickedHandler}
                      />
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

export default SignaleProblem;
