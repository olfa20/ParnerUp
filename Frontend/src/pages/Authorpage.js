import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import ProfiledetailAppowner from "../components/Appowner/ProfiledetailAppowner";
import Profiledetail from "../components/Profiledetail";
import Profilephoto from "../components/Profilephoto";
import ProfilecardTwo from "../components/ProfilecardTwo";
import Createpost from "../components/Createpost";
import Events from "../components/Events";
import Postview from "../components/Postview";
import Load from "../components/Load";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import PostviewApp from "../components/Appowner/PostviewApp";

const Authorpage = () => {
  const [Error, setError] = useState();
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    fname: "",
    lname: "",
    description: "",
    phone: "",
    profileImage: "",
    couvertureImage: "",
    company: "",
  });

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/appowner/${auth.userId}`,
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
        console.log(result);

        setPosts(result);
      } catch (err) {
        setError(err);
      }
    };

    if (auth.userId) {
      fetchPosts();
    }
  }, [auth.userId]);
  return (
    <Fragment>
      <Header img={formData.profileImage} />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <ProfilecardTwo
                  company={formData.company}
                  email={formData.email}
                  userType={auth.userType}
                  img={formData.profileImage}
                  couverture={formData.couvertureImage}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                <ProfiledetailAppowner
                  description={formData.description}
                  phone={formData.phone}
                  location={formData.location}
                />

                <Events />
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost userType={auth.userType} />
                {posts &&
                  posts.map((post) => (
                    <div key={post._id}>
                      <PostviewApp
                        company={formData.company}
                        postvideo=""
                        postimage={formData.profileImage}
                        avater="user.png"
                        time="22 min ago"
                        des={post.description}
                        createdAt={new Date(post.date).toLocaleDateString()}
                        createdAtt={new Date(post.date).toLocaleTimeString()}
                        postId={post._id}
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

export default Authorpage;
