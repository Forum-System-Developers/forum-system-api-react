import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';


const ContactListItem = ({ user, index, style, handleUserSelect, pendingMessages }) => {
    return (
        <ListItem disablePadding style={style}>
            <ListItemButton onClick={() => handleUserSelect(user, index)}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText 
                    primary={user.username}
                    style={{ color: pendingMessages > 0 ? 'rgb(67, 135, 160)' : 'inherit' }}  
                />
            </ListItemButton>
        </ListItem>
    );
}

export default ContactListItem;
