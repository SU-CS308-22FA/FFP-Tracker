import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FFP_API from "../../app/api";

const theme = createTheme();

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{6,20}$/;
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function SignUpComponent() {
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
        "Password must be 6-20 characters long and contain only letters, numbers, and !@#$%.";
    } else if (!EMAIL_REGEX.test(data.get("email"))) {
      error = "Email must be a valid email address.";
    } else if (data.get("password") !== data.get("repassword")) {
      error = "Passwords must match.";
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = validate(data);
    if (result !== "") {
      setE(true);
      setErrorMessage(result);
    } else {
      try {
        await FFP_API.post("/users", {
          fullname: data.get("firstname") + " " + data.get("lastname"),
          username: data.get("username"),
          email: data.get("email"),
          password: data.get("password"),
          key: data.get("key"),
        });
        alert("Successfully created your account. Please log in!");
        navigate("/login");
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data.error);
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 25, ml: 15 }}
            >
              <Avatar
                align="center"
                src="favicon.ico"
                sx={{ width: 400, height: 200 }}
                variant="square"
              />
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Container maxWidth="sm">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h4" mt={6}>
                  Sign Up
                </Typography>
                <Typography component="h1" variant="h6" mt={3} mb={2}>
                  Already have an account? <Link href="/login">Sign in!</Link>
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  alignItems="center"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="key"
                        required
                        fullWidth
                        id="key"
                        label="Registration Key"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={5.5}>
                      <TextField
                        autoComplete="given-name"
                        name="firstname"
                        required
                        fullWidth
                        id="firstname"
                        label="First Name"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6.5}>
                      <TextField
                        required
                        fullWidth
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        autoComplete="family-name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                      />
                    </Grid>
                    <Grid item xs={12} sm={5.5}>
                      <TextField
                        required
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
                        required
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
                    sx={{
                      mt: 2,
                      mb: 4,
                      bgcolor: "#51087E",
                      "&:hover": {
                        backgroundColor: "#51087E",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
