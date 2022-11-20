import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

function ProfileAppBar(navItems) {
  const { user, setUser } = useContext(UserContext);
  console.log(user._id);
  const nav = navItems["navItems"];
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
            <Link to={`/my/profile/${user._id}`}>FFP Tracker for TFF</Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {nav.map((item) => (
              <Button key={item} sx={{ color: "#FFFFFF" }}>
                <Link to={`/${item.toLowerCase().replace(" ", "")}`}>
                  {item}
                </Link>
              </Button>
            ))}
          </Box>
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to={`/my/profile/edit/${user._id}`}>Edit Your Profile</Link>
          </Button>
          <Button sx={{ color: "#FFFFFF" }}>
            <Link to="/login">Log Out</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ProfileAppBar;
