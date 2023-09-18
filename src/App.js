import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { Get, Post } from "./api";

import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);
  const [inboxList, setInboxList] = useState([]);
  const [my_id, setMyID] = useState(3);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messagesLength, setLength] = useState(0);
  const [activeUserIndex, setActiveUserIndex] = useState(0);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };


  useEffect(() => {
    GetMessagesIntervel();

    const intervalId = setInterval(GetMessagesIntervel, 5000);

    return () => clearInterval(intervalId);
  }, [selectedUser, inboxList]);

  const GetMessagesIntervel = () => {
    if (selectedUser?.user_id) {
      getAllMessages(my_id, selectedUser?.user_id);
      return;
    } else if (inboxList[0]?.user_id) {
      getAllMessages(my_id, inboxList[0]?.user_id);

      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    getAllInboxList(my_id);

    // Create an interval to call getAllInboxList every 5 seconds
    const intervalId = setInterval(() => {
      getAllInboxList(my_id);
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [my_id]);

  const getAllInboxList = (my_id) => {
    Get({ endpoint: `/my-contact/${my_id}` })
      .then((res) => {
        const { contact } = res;
        setInboxList(contact);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getAllMessages = (my_id, user_id) => {
    Get({ endpoint: `/get-messages/${my_id}/${user_id}` })
      .then((res) => {
        const { messages } = res;
        if (messages?.length !== messagesLength) {
          console.log("message?.length", messages?.length);
          setMessages(messages.reverse());
          setLength(messages?.length);
          scrollToBottom();

        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const sendMessage = (data) => {
    Post({ endpoint: "/send-message", data: data })
      .then((res) => {
        const { messages } = res;
        setMessages((prev) => [
          ...prev,
          {
            content: newMessage,
            sender_id: my_id,
            receiver_id: selectedUser?.user_id,
          },
        ]);
        setActiveUserIndex(0);
        getAllInboxList(my_id);
        scrollToBottom();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleUserSelection = (user, index) => {
    setSelectedUser(user);
    setActiveUserIndex(index);
    getAllMessages(my_id, user?.user_id);
    setLength(0);
    scrollToBottom()
  };

  const profile = "https://www.w3schools.com/howto/img_avatar.png";

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-md-4 chatbox-sidebar">
          {inboxList.map((user, index) => (
            <div
              key={index}
              className={`User contact ${
                index === activeUserIndex ? "Active-user" : ""
              }`}
              onClick={() => handleUserSelection(user, index)}
            >
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "100%",
                  marginRight: "16px",
                }}
                src={user?.image ? user?.image : profile}
                alt={`${user.name}`}
              />
              <div style={{ flexDirection: "column" }}>
                <p>{user?.username}</p>
                <p>{user?.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-md-8 chatbox-main">
          {Array.isArray(messages) ? (
            messages.slice(0).map((message, index) => {
              const { created_at } = message;
              const formattedTime = created_at ? formatDate(created_at) : "";
              const isLink =
                message?.content?.startsWith("http") ||
                message?.content?.startsWith("https");
              return (
                <div
                  ref={messageContainerRef}
                  key={index}
                  className={`Message ${
                    message.sender_id === my_id
                      ? "User-message"
                      : "Other-message"
                  }`}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {isLink ? (
                      <a
                        href={message.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(message.content, "_blank");
                        }}
                      >
                        {message.content}
                      </a>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <p
                      style={{
                        fontSize: 10,
                        alignSelf: "flex-end",
                        marginTop: 5,
                      }}
                    >
                      {formattedTime}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages available.</p>
          )}

          <div style={{ alignSelf: "center" }} className="Message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  let data = {
                    content: newMessage,
                    sender_id: my_id,
                    receiver_id: selectedUser?.user_id,
                  };
                  scrollToBottom();
                  sendMessage(data);
                  setNewMessage("");
                }
              }}
            />
            <button
              onClick={() => {
                let data = {
                  content: newMessage,
                  sender_id: my_id,
                  receiver_id: selectedUser?.user_id,
                };
                sendMessage(data);

                scrollToBottom();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
