import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FFP_API from "../app/api";

import Container from "@mui/material/Container";
import CircularProgressComponent from "./CircularProgressComponent";

export default function ProfilePageComponent() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await FFP_API.get(`/users/${id}`);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);
  const content = !user ? (
    <CircularProgressComponent />
  ) : (
    <>
      <Container component="main" maxWidth="xs">
        <h1>Welcome, {user.fullname}</h1>
        <Button
          onClick={() => {
            navigate(`/my/profile/edit/${id}`);
          }}
        >
          Edit Your Profile
        </Button>
      </Container>
    </>
  );
  return content;
}
