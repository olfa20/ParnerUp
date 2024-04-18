import React, { Component, Fragment, useEffect, useState } from "react";

import Leftnav from "../../components/Leftnav";
import Appfooter from "../../components/Appfooter";
import Popupchat from "../../components/Popupchat";
import Postview from "../../components/Postview";
import ProfiledetailAppowner from "../../components/Appowner/ProfiledetailAppowner";
import ProfilecardTwo from "../../components/ProfilecardTwo";
import Load from "../../components/Load";
import Header from "../../components/Header";
import PostviewApp from "../../components/Appowner/PostviewApp";
import { useParams } from "react-router-dom";
import Rightchat from "../../components/Rightchat";
import { AuthContext } from "../../shared/authContext";
import { useContext } from "react";
import Events from "../../components/Events";
import Createpost from "../../components/Search/CreatePost";
import { useHistory } from "react-router-dom";

const ProfileSearchapp = () => {
  const history = useHistory();
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
  let { id } = useParams();

  useEffect(() => {
    if (id === auth.userId) {
      history.push("/notfound");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appowner/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        console.log(result);

        setFormData(result.user);

        // Set isCurrentUser to true if the logged-in user's ID matches the ID in the URL
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (id === auth.userId) {
      history.push("/notfound");
    }
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/poste/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
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
  }, [id]);

  return (
    <Fragment>
      <Header />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <ProfilecardTwo
                  id={id}
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
                {/* <Profilephoto /> */}
                <Events />
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost userType={auth.userType} id={id} />
                {posts &&
                  posts.map((post) => (
                    <div key={post._id}>
                      <PostviewApp
                        id={id}
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

export default ProfileSearchapp;
