import { Navigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function ProfilePageComponent() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);

  const content = !user ? (
    <Navigate to="/login" />
  ) : (
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
