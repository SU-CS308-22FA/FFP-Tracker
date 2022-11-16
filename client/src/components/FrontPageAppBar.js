import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
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
