import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';


const ContactListItem = ({ user, handleUserSelect, pendingMessages }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={() => handleUserSelect(user)}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={user.username} />
                {pendingMessages > 0 && <ListItemText primary={pendingMessages} />}
            </ListItemButton>
        </ListItem>
    );
}

export default ContactListItem;
