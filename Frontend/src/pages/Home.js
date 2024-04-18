import React, { Component, Fragment, useEffect, useState } from "react";

import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import Friends from "../components/Friends";
import Contacts from "../components/Contacts";
import Group from "../components/Group";
import Events from "../components/Events";
import Createpost from "../components/Createpost";
import Memberslider from "../components/Memberslider";
import Friendsilder from "../components/Friendsilder";
import Storyslider from "../components/Storyslider";
import Postview from "../components/Postview";
import Load from "../components/Load";
import Profilephoto from "../components/Profilephoto";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import PostviewAll from "../components/PostviewAll";

const Home = () => {
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/poste/all/${auth.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setPosts(result.posts);
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
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-16 col-xxl-9 col-lg-8">
                {/* <Storyslider /> */}
                <Createpost />
                {posts &&
                  posts.map((post) => (
                    <div key={post._id}>
                      <PostviewAll
                        postvideo=""
                        postimage={post.created_by?.profileImage}
                        avater="user.png"
                        user={
                          post.created_by?.userType === "influencer"
                            ? post.created_by.fname +
                              " " +
                              post.created_by.lname
                            : post.created_by?.company
                        }
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
              {/* <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
               <Friends />
                <Contacts /> 
             <Group /> 
                <Events /> 
                 <Profilephoto /> 
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Home;
