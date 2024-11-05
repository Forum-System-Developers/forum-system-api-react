import { useEffect, useState, useRef } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";

import axiosInstance from "../../service/axiosInstance";
import MessageCard from "./MessageCard";
import ContactListItem from "./ContactListItem";
import MessageInputField from "./MessageInputField";

import createWebSocket from "../../service/WebSocketManager";
import "../../styles/conversation_view.css";


export default function ConversationView() {
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState('');
    const receiverRef = useRef(receiver);
    const chatEndRef = useRef(null);
    const socket = useRef(null);
    const drawerWidth = 240;

    useEffect(() => {
        axiosInstance
        .get("/conversations/contacts/")
        .then((response) => {
            setContacts(response.data);
        })
        .catch((error) => {
            console.error("Error fetching conversations:", error);
        });
    }, []);

    
    useEffect(() => {
        socket.current = createWebSocket((message) => {
            const author_id = message.author_id;
            const receiver_id = receiverRef.current.id;
            if (author_id === receiver_id) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });
        
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);

    useEffect(() => {
        receiverRef.current = receiver;
    }, [receiver]);
    
    useEffect(() => { 
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);
    
    const handleUserSelect = (user) => {
        if (user.id === receiver.id) {
            return;
        }
        axiosInstance
            .get(`/messages/${user.id}/`)
            .then((response) => {
                setReceiver(user);
                setMessages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    };

    const handleSendMessage = (message) => {
        axiosInstance
        .post("/messages/", {
            content: message,
            receiver_id: receiver.id,
        })
        .then((response) => {
            if (response.status === 201) {
                setMessages([...messages, response.data]);
            }
        })
        .catch((error) => {
            console.error("Error sending message:", error);
        }); 
    }

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="home-container">
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            marginTop: "80px",
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <List>
                    {contacts.map((user, index) => (
                        <ContactListItem 
                            key={index} 
                            user={user} 
                            handleUserSelect={handleUserSelect} 
                        />
                    ))}
                    </List>
                </Drawer>
                <Box
                    sx={{
                        flexGrow: 1,
                        position: 'static',
                        top: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        // height: '100vh',
                        paddingBottom: 5,
                        bgcolor: 'background.default',
                        // p: 3,
                    }}
                >
                    <Box sx={{ 
                        flexGrow: 1, 
                        bgcolor: "background.default", 
                        p: 1,
                        position: 'sticky', 
                    }}>
                    {messages.map((message, index) => (
                        <Box 
                            key={index} 
                            sx={{ mb: 1 , '&:hover': {boxShadow: 6}}}
                        >
                            <MessageCard 
                                message={message.content} 
                                author={message.author_id === receiver.id ? receiver.username : 'You'} 
                                timestamp={formatTime(message.created_at)}
                            />
                        </Box>
                    ))}
                    </Box>
                    { receiver && (
                    <Box className="footer">
                        <MessageInputField 
                            receiver={receiver.username} 
                            handleSendMessage={handleSendMessage} 
                        />
                    </Box>
                )}
                <div ref={chatEndRef} />
                </Box>
            </Box>
        </div>
    );
}
