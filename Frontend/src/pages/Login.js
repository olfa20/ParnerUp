import React, { Fragment, useState, useContext, useEffect } from "react";
import login from "../images/login.jpg";
import { AuthContext } from "../shared/authContext";
import { Link, useHistory } from "react-router-dom";

const Login = () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState(null);
  const history = useHistory();
  const [rememberMe, setRememberMe] = useState(false);

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const rememberMe = localStorage.getItem("rememberMe");

    if (email && password && rememberMe === "true") {
      setFormdata({ ...formdata, email, password });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formdata.email,
          password: formdata.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      auth.login(
        responseData.userId,
        responseData.token,
        responseData.userType,
        responseData.active
      );

      if (responseData.active === false) {
        history.push("/notfound");
      } else if (responseData.userType === "influencer") {
        history.push("/userpage");
      } else if (responseData.userType === "appowner") {
        history.push("/");
      } else if (responseData.userType === "admin") {
        history.push("/cart");
      } else if (responseData.userType === "superadmin") {
        history.push("/defaultsettings");
      } else {
        history.push("/");
      }

      // Store email, password, and "Remember me" checkbox in local storage
      if (rememberMe) {
        localStorage.setItem("email", formdata.email);
        localStorage.setItem("password", formdata.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Fragment>
        <div className="main-wrap">
          <div className="nav-header bg-transparent shadow-none border-0">
            <div className="nav-top w-100">
              <a href="/">
                <i className="feather-zap text-success display1-size me-2 ms-0"></i>
                <span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
                  PartnerUp{" "}
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
                backgroundImage: `url(${login})`,
              }}
            ></div>
            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
              <div className="card shadow-none border-0 ms-auto me-auto login-card">
                <div className="card-body rounded-0 text-left">
                  <h2 className="fw-700 display1-size display2-md-size mb-3">
                    Login into <br />
                    your account
                  </h2>
                  <form>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-email text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your Email Address"
                        name="email"
                        value={formdata.email}
                        id="email"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group icon-input mb-1">
                      <input
                        type="Password"
                        className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                        placeholder="Password"
                        name="password"
                        value={formdata.password}
                        id="password"
                        onChange={handleChange}
                      />
                      <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                    </div>
                    <div className="form-check text-left mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-2"
                        id="exampleCheck5"
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />

                      <label className="form-check-label font-xsss text-grey-500">
                        Remember me
                      </label>
                      <a
                        href="/forgot"
                        className="fw-600 font-xsss text-grey-700 mt-1 float-right"
                      >
                        Forgot your Password?
                      </a>
                    </div>
                  </form>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="col-sm-12 p-0 text-left">
                    <div className="form-group mb-1">
                      <button
                        type="submit"
                        className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                      >
                        Login
                      </button>
                    </div>
                    <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                      Dont have account{" "}
                      <a href="/register" className="fw-700 ms-1">
                        Register
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </form>
  );
};

export default Login;
