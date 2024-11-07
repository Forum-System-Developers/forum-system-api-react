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
                <ListItemText primary={user.username} />
                {pendingMessages > 0 && <ListItemText primary={pendingMessages} sx={{color: 'rgb(67, 135, 160)'}}/>}
            </ListItemButton>
        </ListItem>
    );
}

export default ContactListItem;
