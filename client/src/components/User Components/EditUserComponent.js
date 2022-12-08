import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FFP_API from "../../app/api";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const theme = createTheme();

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

export default function EditUserComponent() {
  const [e, setE] = useState(false);
  const { user, setToken, setLogin, setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullname, setFullname] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const navigate = useNavigate();
  const validate = (data) => {
    setE(false);
    setErrorMessage("");
    let error = "";
    let pass = data.get("password");
    let repass = data.get("re-password");
    if (!USER_REGEX.test(data.get("username"))) {
      error =
        "Username must be 3-20 characters long and contain only letters and numbers.";
    } else if (pass && !PWD_REGEX.test(data.get("password"))) {
      error =
        "Password must be 4-20 characters long and contain only letters, numbers, and !@#$%.";
    } else if (repass && data.get("password") !== data.get("repassword")) {
      error = "Passwords must match.";
    }
    return error;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setE(false);
    setErrorMessage("");
    const data = new FormData(e.currentTarget);
    const result = validate(data);
    if (result !== "") {
      setE(true);
      setErrorMessage(result);
    } else {
      try {
        await FFP_API.patch(`/users/${user._id}`, {
          fullname: data.get("fullname"),
          username: data.get("username"),
          password: data.get("password"),
        });
        window.location.reload();
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data);
      }
    }
  };

  const handleDeleteAccount = async (e) => {
    console.log("delete");
    try {
      console.log("here");
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      await FFP_API.request(`/users/${user._id}`, options);
      setToken(null);
      setLogin(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

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
                    required
                    id="fullname"
                    label="Full Name"
                    autoFocus
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    name="re-password"
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
