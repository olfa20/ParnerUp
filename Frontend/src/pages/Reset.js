import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect,
} from "react";
import { AuthContext } from "../shared/authContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import reset from "../images/Change.jpg"

const Reset = () => {
  const auth = useContext(AuthContext);
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const param = useParams();

  const url = `http://localhost:5000/password-reset/${param.id}/${param.token}`;

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:5000/password-reset/${param.id}/${param.token}`;
        console.log(param.token);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
          },
        });

        const data = await response.json();
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param, url]);


  // console.log(param.token,param.id)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const url = `http://localhost:5000/password-reset/${param.id}/${param.token}`;
  
      const response = await axios.post(url, { password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      setMsg(data.message);
      setError("");
  
      // Wait for the password reset process to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Navigate to the login page
      window.location = "/login";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };
  

  return (
    <Fragment>
      {validUrl ? (
        <form onSubmit={handleSubmit}>
          <div className="main-wrap">
            <div className="nav-header bg-transparent shadow-none border-0">
              <div className="nav-top w-100">
                <a href="/">
                  <i className="feather-zap text-success display1-size me-2 ms-0"></i>
                  <span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
                  PartnerUp.{" "}
                  </span>{" "}
                </a>
                <button className="nav-menu me-0 ms-auto"></button>

                <a
                  href="/login"
                  className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"
                >
                  Register
                </a>
              </div>
            </div>

            <div className="row">
              <div
                className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${reset})`,
                }}
              ></div>

              <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                <div className="card shadow-none border-0 ms-auto me-auto login-card">
                  <div className="card-body rounded-0 text-left">
                    <h2 className="fw-700 display1-size display2-md-size mb-4">
                      Change <br />
                      your password
                    </h2>
                    <form>
                      <div className="form-group icon-input mb-3">
                        <input
                          type="Password"
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="New Password"
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                        />
                        <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                      </div>
                    </form>

                    <div className="col-sm-12 p-0 text-left">
                      <div className="form-group mb-1">
                        <button
                          type="submit"
                          className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </Fragment>
  );
};

export default Reset;
