import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import FFP_API from "../../app/api";

const theme = createTheme();

export default function LoginComponent() {
  const { setToken, setLogin } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setE(false);
    setErrorMessage("");
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const res = await FFP_API.post("/auth", {
        email: data.get("email"),
        password: data.get("password"),
      });
      setToken(res.data.accessToken);
      setLogin(true);
      alert("You have successfully logged in!");
      navigate("/my/profile/");
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            Log In
          </Typography>
          <Typography variant="h6" mt={3} mb={2}>
            Don't have an account? <Link href="/signup">Sign up!</Link>
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
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
                backgroundColor: "#51087E",
                "&:hover": {
                  backgroundColor: "#51087E",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
