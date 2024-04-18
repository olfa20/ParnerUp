import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const ChatComponent = ({ senderId, receiverId }) => {
  const history = useHistory()
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const bottomRef = useRef(null);
  const [media, setMedia] = useState(null);
  const [limit, setLimit] = useState(4);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setMedia(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("sender", senderId);
    formData.append("receiver", receiverId);
    formData.append("message", message);

    if (media) {
      formData.append("media", media);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("");
      setLimit(4);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChats = async () => {
    const response = await axios.get(
      `http://localhost:5000/chat/${senderId}/${receiverId}/${limit}`
    );
    setChats(response.data);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await axios.post("http://localhost:5000/chat", {
  //       sender: senderId,
  //       receiver: receiverId,
  //       message,
  //     });

  //     setMessage("");
  //     setLimit(4);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const showMore = () => {
    let val = limit + 4;
    setLimit(val);
    fetchChats();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChats();
    }, 1000);
    return () => clearInterval(interval);
  });

 

  return (
    <div className="main-content right-chat-active">
      <div className="middle-sidebar-bottom">
        <div className="middle-sidebar-left pe-0" style={{ maxWidth: "100%" }}>
          <div className="row">
            <div className="col-lg-12 position-relative">
              <div className="chat-wrapper pt-0 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                <div className="chat-body p-3 ">
                  <button
                    className="btn btn-outline-secondary d-block mx-auto mt-4 px-5 py-2"
                    onClick={() => showMore()}
                  >
                    Show More
                  </button>

                  <div className="messages-content pb-5">
                    {chats.map((chat) => (
                      <div
                        className={`message-item ${
                          chat.sender._id === senderId ? "outgoing-message" : ""
                        }`}
                        key={chat._id}
                      >
                        <div className="message-user">
                          <img
                            src={`http://localhost:5000/${chat.sender.profileImage}`}
                            alt=""
                            className="w35 me-2 rounded-circle"
                          />
                          <div>
                            <div className="message-wrap">
                              {chat.message &&
                              chat.message.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                <img
                                  src={`http://localhost:5000/${chat.message}`}
                                  alt=""
                                  className="message-image"
                                  style={{ height: "80px", width: "80px" }}
                                />
                              ) : (
                                <div className="message-text">
                                  {chat.message}
                                </div>
                              )}
                            </div>
                            <div className="time">
                              {new Date(chat.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
              <div
                className="chat-bottom dark-bg p-3 shadow-none theme-dark-bg"
                style={{ width: "98%", height: "90px" }}
              >
                <form onSubmit={handleSubmit} className="chat-form">
                  {/* <div style={{ marginTop: "-30px" }} className="style2-input">
                    <input
                      type="text"
                      placeholder="Start typing.."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      style={{ color: "black", height: "28px" }}
                    />
                  </div> */}
                  <div style={{ marginTop: "-43px" }} className="style2-input">
                    <input
                      type="text"
                      placeholder="Start typing.."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      style={{
                        color: "black",
                        height: "28px",
                        border: "1px solid black",
                        height: "45px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "2px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="style2-input"
                  >
                    <input
                      type="file"
                      name="media"
                      accept="image/*"
                      onChange={(event) => setMedia(event.target.files[0])}
                      style={{ color: "black" }}
                    />
                    <button
                      className="bg-current"
                      style={{ marginLeft: "5px" }}
                    >
                      <i className="ti-arrow-right text-white"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
