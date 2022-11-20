import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Avatar, Button, useColorScheme } from "@mui/material";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function ProfileAppBar() {
  const { user, setUser } = React.useContext(UserContext);
  const navigate = useNavigate();
  const items =
    user.role === "Team Admin" ? (
      <>
        <Button
          variant="contained"
          onClick={() => navigate(`/my/profile/submit/${user._id}`)}
          sx={{
            backgroundColor: "#51087E",
            "&:hover": {
              backgroundColor: "#51087E",
            },
          }}
        >
          Submit Files
        </Button>
      </>
    ) : user.role === "TFF Admin" ? (
      <></>
    ) : (
      <></>
    );

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
            <Link to="">FFP Tracker for TFF</Link>
          </Typography>
          <Link>{items}</Link>
          <Link to="/login">LOGOUT</Link>
          <Box sx={{ ml: 2 }}></Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ProfileAppBar;
