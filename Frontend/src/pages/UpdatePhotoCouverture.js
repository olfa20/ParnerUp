import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import { Link, useHistory, useParams } from "react-router-dom";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";

const UpdatePhotoCouverture = () => {
  const auth = useContext(AuthContext);

  const [formdata, setFormdata] = useState({
    couvertureImage: null,
  });

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [oldImg, setOldImg] = useState();
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/influencer/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setFormdata(result.user);
        setOldImg(
          result.user.couvertureImage
            ? "http://localhost:5000/" + result.user.couvertureImage
            : "https://via.placeholder.com/300x300.png"
        );
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth.userId]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("couvertureImage", formdata.couvertureImage);

      const response = await fetch(
        `http://localhost:5000/influencer/couvertureImage/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      history.push("/userpage");
      //   history.go(0);
    } catch (err) {
      setError(true);
      setMessage(err.message);
      console.log(err.message);
    }
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

        <div className="main-content bg-lightblue theme-dark-bg right-chat-active" style={{height:"1000px"}}>
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left">
              <div className="middle-wrap">
                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                  <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                    <Link to="/defaultsettings" className="d-inline-block mt-2">
                      <i className="ti-arrow-left font-sm text-white"></i>
                    </Link>
                    <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                      Photo de couverture
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
                        <div className="col-lg-6 mb-3"></div>
                      </div>

                      <div className="row"></div>

                      <div className="row">
                        <div className="col-lg-12 mb-3"></div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 mb-3"></div>

                        <div className="col-lg-12 mb-3">
                          <div className="card mt-3 border-0">
                            <div className="card-body d-flex justify-content-between align-items-end p-0">
                              <div className="form-group mb-0 w-100">
                                <input
                                  type="file"
                                  name="couvertureImage"
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

export default UpdatePhotoCouverture;
