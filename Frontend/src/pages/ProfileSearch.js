import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import EventsSearch from "../components/EventsSearch";
import Profiledetail from "../components/Profiledetail";
import Profilephoto from "../components/Profilephoto";
import ProfilecardThree from "../components/ProfilecardThree";
import Createpost from "../components/Createpost";
import Events from "../components/Events";
import Postview from "../components/Postview";
import Load from "../components/Load";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { useAuth } from "../shared/authHook";
import Notfound from "./Notfound";
import { useHistory } from "react-router-dom";

const ProfileInfluencer = () => {
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState();
  let { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [IsInfluencer, setIsInfluencer] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    fname: "",
    lname: "",
    category: "",
    description: "",
    city: "",
    country: "",
    phone: "",
    postDescription: "",
    profileImage: "",
    company: "",
  });
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (id === auth.userId) {
      history.push("/notfound");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/influencer/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();

        if (result.success) {
          // The user is an influencer
          setIsInfluencer(true);
          setUserType(result.user.userType);
          setFormData(result.user);
        } else {
          // The user is not an influencer, fetch data for app owners
          setIsInfluencer(false);

          const response = await fetch(`http://localhost:5000/appowner/${id}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          });
          const result = await response.json();

          setFormData(result);
        }
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, auth.userId]);

  useEffect(() => {
    if (id === auth.userId) {
      history.push("/notfound");
    }
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/poste/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer ",
          },
        });
        const result = await response.json();
        console.log(result);

        setPosts(result);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchPosts();
    }
  }, [id, auth.userId]);

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree
                  fname={IsInfluencer ? formData.fname : formData.company} // Display first name for influencers, company for app owners
                  lname={IsInfluencer ? formData.lname : ""} // Display last name for influencers only
                  email={formData.email}
                  img={formData.profileImage}
                  imgcouverture={formData.couvertureImage}
                  id={id}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                <Profiledetail
                  description={formData.description}
                  city={formData.city}
                  country={formData.country}
                  phone={formData.phone}
                  category={formData.category}
                />

                <EventsSearch id={id} />
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                {posts &&
                  posts.map((post) => (
                    <div key={post._id}>
                      <Postview
                        postvideo=""
                        postimage={formData.profileImage}
                        avater="user.png"
                        user={formData.lname}
                        fname={formData.fname}
                        time="22 min ago"
                        des={post.description}
                        postId={post._id}
                        postphoto={post.media}
                        post={post}
                        id={id}
                        title={post.title}
                      />
                   
                    </div>
                  ))}
                <Load />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default ProfileInfluencer;
