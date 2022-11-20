import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function FrontPageAppBar(navItems) {
  const navigationItems = navItems["navItems"];
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
            <Link to="/home">FFP Tracker for TFF</Link>
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navigationItems.map((item) => (
              <Button key={item} sx={{ color: "#FFFFFF" }}>
                <Link to={`/${item.toLowerCase().replace(" ", "")}`}>
                  {item}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default FrontPageAppBar;
