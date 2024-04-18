import React, { Component, Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useAuth } from "../shared/authHook";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import Conversation from "../components/Conversation";
import Pagetitle from "../components/Pagetitle";

const Messagerie = () => {
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const [chats, setChats] = useState([]);
  async function getChats() {
    if (search.length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/${auth.userId}/${search}`
        );
        setChats(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/all/${auth.userId}`
        );
        // console.log(response);
        setChats(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  useEffect(() => {
    setTimeout(getChats, 1000);
  }, [search]);

  return (
    <>
      <Fragment>
        <Header />

        <div className="main-content right-chat-active">
          <div className="middle-sidebar-bottom">
            <div
              className="middle-sidebar-left pe-0 ps-lg-3 ms-0 me-0"
              style={{ maxWidth: `100%` }}
            >
              <div className="row">
                <div className="col-lg-12"></div>
                <Pagetitle
                  getChats={getChats}
                  setSearch={setSearch}
                  search={search}
                  title="Messages"
                />

                {chats &&
                  chats.map((chat) => (
                    <div>
                      <Conversation
                        search={search}
                        sender={chat.sender}
                        receiver={chat.receiver}
                        data={chat}
                        chatMessage={chat.message}
                        currentUserId={auth.userId}
                        createdAt={new Date(
                          chat.createdAt
                        ).toLocaleTimeString()}
                        createdAtt={new Date(
                          chat.createdAt
                        ).toLocaleDateString()}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Popupchat />
        <Appfooter />
      </Fragment>
    </>
  );
};

export default Messagerie;
