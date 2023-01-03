import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import FFP_API from "../../app/api";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";

function ProfileAppBar() {
  const { user, setUser, setToken, setLogin } = useContext(UserContext);
  const [notifications, setNotifications] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await FFP_API.get(`/notifications`);
      setNotifications(response.data);
    };
    fetchNotifications();
  }, [setNotifications]);

  // find number of notifications
  let countNotifications = 0;
  if (notifications) {
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].receiver === user._id) {
        countNotifications++;
      }
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        sx={{ bgcolor: "#51087E" }}
        elevation={0}
        position="static"
      >
        <Toolbar>
          <Avatar src="https://pbs.twimg.com/profile_images/1333774609494241281/BPF9ei6K_400x400.jpg" />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" }, ml: 2 }}
          >
            <Link to={`/my/profile`}>FFP Tracker for TFF</Link>
          </Typography>
          <Button
            sx={{ color: "#FFFFFF" }}
            onClick={() => navigate("/my/profile")}
          >
            Profile
          </Button>
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to="/my/profile/notifications">Notifications</Link>
            <Badge badgeContent={countNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </Button>
          <Button
            sx={{ color: "#FFFFFF" }}
            onClick={() => {
              setLogin(false);
              setToken(null);
              setUser(null);
            }}
          >
            <Link to="/login">Log Out</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ProfileAppBar;
