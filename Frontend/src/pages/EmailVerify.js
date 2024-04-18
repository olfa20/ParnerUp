import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:5000/${param.userType}/${param.id}/verify/${param.token}`;

        const response = await fetch(url, { method: "GET" });
        const data = await response.json();
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <Fragment>
      {validUrl ? (
        <>
          <form>
            <div className="card-body rounded-0 text-left">
              <h2 className="fw-700 display1-size display2-md-size mb-3">
                Login into <br />
                your account
              </h2>
            </div>
          </form>
          <div className="form-group mb-1">
            <Link to="/">
              <button className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                Login
              </button>
            </Link>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Fragment>
  );
};
export default EmailVerify;
