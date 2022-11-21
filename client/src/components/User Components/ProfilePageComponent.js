import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

export default function ProfilePageComponent({ user }) {
  const content = (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ m: 4 }} align="center">
          Welcome, {user.fullname}!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }} align="center"></Typography>
      </Container>
    </>
  );
  return content;
}
