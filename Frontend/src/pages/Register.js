import React, { Component, Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../shared/authContext";
import resgistre from "../images/resgistre.jpg";

const Register = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formdata, setFormdata] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    userType: "",
    company: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("influencer");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInfluencer = (event) => {
    setUserType("influencer");
  };
  const handleAppowner = (event) => {
    setUserType("appowner");
  };
  const handleAdmin = (event) => {
    setUserType("admin");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);

    {
      try {
        console.log(formdata.email);
        const response = await fetch("http://localhost:5000/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fname: formdata.fname,
            lname: formdata.lname,
            email: formdata.email,
            password: formdata.password,
            company: formdata.company,
            userType: userType,
          }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
          setError(true);
          setMessage(responseData.message);
          throw new Error(responseData.message);
        }
        setSuccess(true);
        auth.login(responseData.userId, responseData.token);

        // history.push("/");
      } catch (error) {
        setError(error.message);
      }
    }
  };
  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  return (
    <form onSubmit={submitHandler}>
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
                backgroundImage: `url(${resgistre})`,
              }}
            ></div>
            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
              <div className="card shadow-none border-0 ms-auto me-auto login-card">
                <div className="card-body rounded-0 text-left">
                  <h2 className="fw-700 display1-size display2-md-size mb-4">
                    Create <br />
                    your account
                  </h2>
                  <form>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-user text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your FirstName"
                        name="fname"
                        value={formdata.fname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-user text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your LastName"
                        name="lname"
                        value={formdata.lname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-email text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your Email Address"
                        name="email"
                        value={formdata.email}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="form-group icon-input mb-3">
                      <input
                        type="password"
                        className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                        placeholder="Password"
                        name="password"
                        value={formdata.password}
                        onChange={handleChange}
                      />
                      <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                    </div> */}
                    <div className="form-group icon-input mb-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                        placeholder="Password"
                        name="password"
                        value={formdata.password}
                        onChange={handleChange}
                      />
                      <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                      <i
                        className="font-sm ti-eye text-grey-500 pe-0"
                        onClick={togglePasswordVisibility}
                        style={{ marginLeft: "300px" }}
                      ></i>
                    </div>

                    <div>
                      <label htmlFor="influencer">
                        <input
                          type="radio"
                          id="influencer"
                          name="userType"
                          value={userType}
                          checked={userType === "influencer"}
                          onChange={handleInfluencer}
                        />
                        Influencer
                      </label>
                      {/* <label htmlFor="admin">
                        <input
                        style={{marginLeft:"10px"}}
                          type="radio"
                          id="admin"
                          name="userType"
                          value={userType}
                          checked={userType === "admin"}
                          onChange={handleAdmin}
                        
                        />
                        Admin
                      </label> */}
                      <label htmlFor="appowner" style={{ marginLeft: "20px" }}>
                        <input
                          type="radio"
                          id="appowner"
                          name="role"
                          value={userType}
                          checked={userType === "appowner"}
                          onChange={handleAppowner}
                        />
                        Company
                      </label>
                    </div>
                    {userType === "appowner" && (
                      <div className="form-group icon-input mb-3">
                        <input
                          className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                          placeholder="Company"
                          name="company"
                          value={formdata.company}
                          onChange={handleChange}
                        />
                        <i className="font-sm ti-briefcase text-grey-500 pe-0"></i>
                      </div>
                    )}
                  </form>

                  <div
                    className="col-sm-12 p-0 text-left"
                    style={{ marginTop: "10px" }}
                  >
                    <div className="form-group mb-1">
                      <button
                        type="submit"
                        className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                      >
                        Register
                      </button>
                    </div>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="alert alert-success" role="alert">
                        An email has been sent to your account. Please verify
                        your email.
                      </div>
                    )}

                    <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                      Already have account{" "}
                      <a href="/login" className="fw-700 ms-1">
                        Login
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

export default Register;
