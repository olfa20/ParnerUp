import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import ChatComponent from "../components/ChatComponent";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";

const Chat = () => {
  const auth = useContext(AuthContext);
  const params = useParams();

  const senderId = auth.userId;
  const receiverId = params.id;
  return (
    <Fragment>
      <Header />
      

      <ChatComponent senderId={senderId} receiverId={receiverId} />
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Chat;
