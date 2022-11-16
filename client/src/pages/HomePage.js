import { Box, Typography } from "@mui/material";
import React from "react";
import FrontPageAppBar from "../components/FrontPageAppBar";
import { Avatar } from "@mui/material";

export default function HomePage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Teams", "Login", "Sign Up"]} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Avatar
          align="center"
          src="favicon.ico"
          sx={{ width: 400, height: 200 }}
          variant="square"
        />
      </Box>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        About This Site - Financial Fair Play Tracker
      </Typography>
      <Typography variant="body1" sx={{ m: 4 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacus
        arcu, sodales vitae libero quis, suscipit elementum tortor. Maecenas
        varius finibus magna, vel varius libero porttitor at. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Nulla porta in velit eleifend cursus. Duis varius vehicula
        vehicula. Nam dignissim blandit feugiat. Praesent vitae massa mauris.
        Vestibulum tempor nisl et condimentum hendrerit. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Quisque lacus arcu, sodales vitae
        libero quis, suscipit elementum tortor. Maecenas varius finibus magna,
        vel varius libero porttitor at. Pellentesque habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas. Nulla porta in
        velit eleifend cursus. Duis varius vehicula vehicula. Nam dignissim
        blandit feugiat. Praesent vitae massa mauris. Vestibulum tempor nisl et
        condimentum hendrerit.
      </Typography>
    </>
  );
  return content;
}
