import { useState } from 'react';

import { TextField, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';


const MessageInputField = ({ handleSendMessage }) => {
    const [message, setMessage] = useState('');

    const onSendMessage = () => {
        if (message.trim() === '') {
            return;
        }
        handleSendMessage(message);
        setMessage('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          onSendMessage();
        }
    };

    return (
        <TextField 
            label="Send a message" 
            id="fullWidth" 
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton 
                                color="primary" 
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
    )
};

export default MessageInputField;
