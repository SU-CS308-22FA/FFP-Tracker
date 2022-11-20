import { Navigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import CircularProgressComponent from "./CircularProgressComponent";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function ProfilePageComponent() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const ButtonContent = (
    <>
      <Button
        variant="contained"
        onClick={() => navigate(`/my/profile/edit/${id}`)}
        sx={{
          backgroundColor: "#51087E",
          "&:hover": {
            backgroundColor: "#51087E",
          },
        }}
      >
        Edit Profile
      </Button>
    </>
  );

  const content = !user ? (
    <Navigate to="/login" />
  ) : (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ m: 4 }} align="center">
          Welcome, {user.fullname}!
        </Typography>
        <Typography variant="body1" sx={{ m: 2 }} align="center">
          As a {user.role}, you can edit your profile, submit and review files,
          and much more things!
        </Typography>
      </Container>
    </>
  );
  return content;
}
