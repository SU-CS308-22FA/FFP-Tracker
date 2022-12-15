import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import { Avatar, Box, Typography, Container } from "@mui/material";

export default function HomePage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Teams", "Sign Up"]} />
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
      <Container maxWidth="md">
        <Typography variant="body1" align="center" sx={{ m: 4 }}>
          This site is for TFF to track the financial status of the teams in the
          Turkish Super League, developed by Team 19. The site is built using
          React, Node.js, Express, and MongoDB. The site is hosted on Heroku.
        </Typography>
      </Container>
    </>
  );
  return content;
}
