import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import CircularProgressComponent from "./CircularProgressComponent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FFP_API from "../app/api";

const theme = createTheme();

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

export default function EditUserComponent() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await FFP_API.get(`/users/${id}`);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validate = (data) => {
    setE(false);
    setErrorMessage("");
    let error = "";
    if (!USER_REGEX.test(data.get("username"))) {
      error =
        "Username must be 3-20 characters long and contain only letters and numbers.";
    } else if (!PWD_REGEX.test(data.get("password"))) {
      error =
        "Password must be 4-20 characters long and contain only letters, numbers, and !@#$%.";
    } else if (data.get("password") !== data.get("repassword")) {
      error = "Passwords must match.";
    }
    return error;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = validate(data);
    if (result !== "") {
      setE(true);
      setErrorMessage(result);
    } else {
      try {
        await FFP_API.patch(`/users/${id}`, {
          fullname: data.get("fullname"),
          username: data.get("username"),
          password: data.get("password"),
        });
        navigate("/users");
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data);
      }
    }
  };

  const handleDeleteAccount = async (e) => {};

  return !user ? (
    <CircularProgressComponent />
  ) : (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Edit Your Information
            </Typography>
            <Box component="form" onSubmit={handleUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="fullname"
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    autoFocus
                    value={user.fullname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={user.username}
                  />
                </Grid>
                <Grid item xs={12} sm={5.5}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12} sm={6.5}>
                  <TextField
                    fullWidth
                    name="repassword"
                    label="Re-Password"
                    type="password"
                    id="re-password"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }} />
              {e && (
                <Alert variant="outlined" severity="error">
                  {errorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 4 }}
              >
                Update
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
              >
                Delete Your account
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
