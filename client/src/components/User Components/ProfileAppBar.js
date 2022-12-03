import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

function ProfileAppBar() {
  const { user, setUser, setToken, setLogin } = useContext(UserContext);
  let nav;
  if (user.role === "Team Admin") {
    nav = (
      <>
        <Button color="inherit" component={Link} to="/submit">
          Submit
        </Button>
      </>
    );
  } else if (user.role === "TFF Admin") {
    nav = (
      <>
        <Button color="inherit" component={Link} to="/newteam">
          Add Team
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Send Key
        </Button>
      </>
    );
  } else {
    nav = (
      <>
        <Button color="inherit" component={Link} to="/review">
          Review Files
        </Button>
      </>
    );
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
          {nav}
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to="/status">File Status</Link>
          </Button>
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to="/my/profile/edit">Edit Profile</Link>
          </Button>
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to="/my/profile/notifications">Notifications</Link>
          </Button>
          <Button color="inherit" component={Link} to="/teams">
            Teams
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
