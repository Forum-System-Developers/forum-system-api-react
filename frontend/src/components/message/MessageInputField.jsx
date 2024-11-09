import { useState } from "react";

import { TextField, IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";

const MessageInputField = ({ receiver, handleSendMessage }) => {
  const [message, setMessage] = useState("");

  const onSendMessage = () => {
    if (message.trim() === "") {
      return;
    }
    handleSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSendMessage();
    }
  };

  return (
    <TextField
      label={receiver ? `@${receiver}` : "Select a contact"}
      fullWidth
      value={message}
      sx={{ backgroundColor: "white" }}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyPress}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="inherit"
                aria-label="send"
                onClick={onSendMessage}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default MessageInputField;
