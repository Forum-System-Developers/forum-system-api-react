import { useEffect, useState, useRef } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { Link } from "react-router-dom";

import axiosInstance from "../../service/axiosInstance";
import MessageCard from "./MessageCard";
import ContactListItem from "./ContactListItem";
import MessageInputField from "./MessageInputField";
import AddIcon from "@mui/icons-material/Add";

import createWebSocket from "../../service/WebSocketManager";
import "../../styles/conversation_view.css";

export default function ConversationView() {
  const [contacts, setContacts] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [activeSelection, setActiveSelection] = useState(null);
  const [messages, setMessages] = useState({});
  const [pendingMessages, setPendingMessages] = useState({});
  const receiverRef = useRef(receiver);
  const chatEndRef = useRef(null);
  const socket = useRef(null);
  const drawerWidth = 240;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, receiver]);

  useEffect(() => {
    socket.current = createWebSocket((message) => {
      const author_id = message.author_id;
      const receiver_id = receiverRef.current.id;
      if (author_id === receiver_id) {
        setMessages((prevMessages) => {
          return {
            ...prevMessages,
            [author_id]: [...(prevMessages[author_id] || []), message],
          };
        });
      } else if (contacts.find((contact) => contact.id === receiver_id)) {
        updatePendingMessages(message);
      } else {
        fetchContacts();
        updatePendingMessages(message);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  const updatePendingMessages = (message) => {
    setPendingMessages((prevPendingMessages) => {
      return {
        ...prevPendingMessages,
        [message.author_id]: [
          ...(prevPendingMessages[message.author_id] || []),
          message,
        ],
      };
    });
  };

  const handleUserSelect = (user, index) => {
    if (user.id === receiver.id) {
      return;
    }
    if (!messages[user.id] || messages[user.id].length === 0) {
      fetchMessages(user);
    } else if (pendingMessages[user.id]) {
      setMessages((prevMessages) => {
        return {
          ...prevMessages,
          [user.id]: [
            ...(prevMessages[user.id] || []),
            ...pendingMessages[user.id],
          ],
        };
      });
    }

    setPendingMessages((prevPendingMessages) => {
      return {
        ...prevPendingMessages,
        [user.id]: [],
      };
    });

    setReceiver(user);
    setActiveSelection(index);
  };

  const handleSendMessage = (message) => {
    axiosInstance
      .post("/messages/", {
        content: message,
        receiver_id: receiver.id,
      })
      .then((response) => {
        if (response.status === 201) {
          setMessages((prevMessages) => {
            return {
              ...prevMessages,
              [receiver.id]: [
                ...(prevMessages[receiver.id] || []),
                response.data,
              ],
            };
          });
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const fetchContacts = () => {
    axiosInstance
      .get("/conversations/contacts/")
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  };

  const fetchMessages = (user) => {
    axiosInstance
      .get(`/conversations/${user.id}/`)
      .then((response) => {
        setMessages((prevMessages) => {
          return {
            ...prevMessages,
            [user.id]: response.data,
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isToday) {
      return `${hours}:${minutes}`;
    } else {
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate().toString();
      return `${month} ${day} ${hours}:${minutes}`;
    }
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="conversation-view">
      <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
        <Drawer
          id="sidebar"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            position: "fixed",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: "80px",
              zIndex: "1000",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <div className="button new-conversation-btn">
              <Link to={`/conversations/new`} className="add-button">
                <AddIcon sx={{ fontSize: 30 }} />
                <span className="button-text">New Conversation</span>
              </Link>
            </div>
            {contacts.map((user, index) => (
              <div className="add-button" key={index}>
                <ContactListItem
                  index={index}
                  user={user}
                  handleUserSelect={handleUserSelect}
                  pendingMessages={
                    pendingMessages[user.id]
                      ? pendingMessages[user.id].length
                      : 0
                  }
                  style={{
                    backgroundColor:
                      activeSelection === index
                        ? "rgb(235, 235, 235)"
                        : undefined,
                  }}
                />
              </div>
            ))}
          </List>
        </Drawer>

        <Box
          id="conversation-view"
          sx={{
            maxWidth: "70%",
            flexGrow: 1,
            position: "static",
            top: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column-reverse",
            paddingBottom: "1%",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 1,
              position: "sticky",
            }}
          >
            {receiver &&
              messages[receiver.id] &&
              messages[receiver.id].map((message, index) => (
                <Box
                  key={index}
                  className={
                    message.author_id === receiver.id
                      ? "message-container left"
                      : "message-container right"
                  }
                >
                  <MessageCard
                    className={
                      message.author_id === receiver.id
                        ? "recipient-message"
                        : "user-message"
                    }
                    message={message.content}
                    author={
                      message.author_id === receiver.id
                        ? receiver.username
                        : "You"
                    }
                    timestamp={formatTime(message.created_at)}
                  />
                </Box>
              ))}
            <div ref={chatEndRef} />
          </Box>
          {receiver && (
            <Box className="footer">
              <MessageInputField
                receiver={receiver.username}
                handleSendMessage={handleSendMessage}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
