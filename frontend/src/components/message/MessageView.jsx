import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";

import axiosInstance from "../../service/axiosInstance";
import MessageCard from "./MessageCard";
import ContactListItem from "./ContactListItem";
import MessageInputField from "./MessageInputField";


export default function MessageView() {
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState('');
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

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleClick = (user) => {
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
                        handleClick={handleClick} 
                    />
                ))}
                </List>
                </Drawer>
                <Box component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        position: 'relative',
                    }}
                >
                    <Box sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
                    {messages.map((message, index) => (
                        <Box 
                            key={index} 
                            sx={{ mb: 2 , '&:hover': {boxShadow: 6}}}
                        >
                            <MessageCard 
                                message={message.content} 
                                author={message.author_id === receiver.id ? receiver.username : 'You'} 
                                timestamp={formatTime(message.created_at)}
                            />
                        </Box>
                    ))}
                    </Box>
                    <Box sx={{ position: 'fixed', bottom: 0, maxWidth: '100%' }}>
                        <MessageInputField handleSendMessage={handleSendMessage} />
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
