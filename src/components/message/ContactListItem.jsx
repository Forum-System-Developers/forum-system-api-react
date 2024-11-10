import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const ContactListItem = ({
  user,
  index,
  style,
  handleUserSelect,
  pendingMessages,
}) => {
  return (
    <li style={style}>
      <ListItemButton onClick={() => handleUserSelect(user, index)}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText
          primary={user.username}
          style={{
            color: pendingMessages > 0 ? "rgb(67, 135, 160)" : "inherit",
          }}
        />
      </ListItemButton>
    </li>
  );
};

export default ContactListItem;
