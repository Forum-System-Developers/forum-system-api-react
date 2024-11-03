import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';


const ContactListItem = ({ key, user, handleClick }) => {
    return (
        <ListItem key={key} disablePadding>
            <ListItemButton onClick={() => handleClick(user)}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={user.username} />
            </ListItemButton>
        </ListItem>
    );
}

export default ContactListItem;
