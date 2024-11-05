import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';


const ContactListItem = ({ user, handleUserSelect }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={() => handleUserSelect(user)}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={user.username} />
            </ListItemButton>
        </ListItem>
    );
}

export default ContactListItem;
