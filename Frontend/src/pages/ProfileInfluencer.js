import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";

import Profiledetail from "../components/Profiledetail";
import Profilephoto from "../components/Profilephoto";
import ProfilecardThree from "../components/ProfilecardThree";
import Createpost from "../components/Createpost";
import Events from "../components/Events";
import Postview from "../components/Postview";
import Load from "../components/Load";

import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import { useAuth } from "../shared/authHook";
import { Link } from "react-router-dom";

const ProfileInfluencer = () => {
  const [error, setError] = useState(null);

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
    couvertureImage: "",
    company: "",
  });
  const [posts, setPosts] = useState([]);
  const auth = useContext(AuthContext);

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
        console.log(result);

        setFormData(result.user);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/poste/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        console.log(result, "aa");
        setPosts(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchPosts();
    }
  }, [auth.userId]);
  const [notifications, setNotifications] = useState([]);

  const handleDelete = (postId) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts([...newPosts]);
  };

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
        console.log(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchData();
    }
  }, [auth]);

  return (
    <Fragment>
      <Header img={formData.profileImage} />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <div className="col-xl-12 mb-3">
                  <ProfilecardThree
                    fname={formData.fname}
                    lname={formData.lname}
                    email={formData.email}
                    img={formData.profileImage}
                    imgcouverture={formData.couvertureImage}
                  />
                </div>
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                <Profiledetail
                  description={formData.description}
                  city={formData.city}
                  country={formData.country}
                  phone={formData.phone}
                  category={formData.category}
                />

                <Events />
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost />

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
                        createdAt={new Date(post.date).toLocaleDateString()}
                        createdAtt={new Date(post.date).toLocaleTimeString()}
                        postId={post._id}
                        onDelete={handleDelete}
                        postphoto={post.media}
                        post={post}
                        category={post.category}
                        hashtags={post.hashtags}
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
