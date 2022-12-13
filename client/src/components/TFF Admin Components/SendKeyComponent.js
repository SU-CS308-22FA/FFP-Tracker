import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FFP_API from "../../app/api";
import { useNavigate } from "react-router-dom";
import { generate } from "@wcj/generate-password";
import emailjs from "@emailjs/browser";

const theme = createTheme();

export default function SendKeyComponent() {
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const form = useRef();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const sendEmail = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      if (role === "Team Admin") {
        await FFP_API.post("/register", {
          email: data.get("email"),
          key: data.get("key"),
          role: role,
          team: data.get("team"),
        });
      } else {
        await FFP_API.post("/register", {
          email: data.get("email"),
          key: data.get("key"),
          role: role,
        });
      }
      alert("Successfully key registered!");
      await emailjs
        .sendForm(
          "service_rqfjoti",
          "contact_form",
          form.current,
          "TC_tgAG2yFIFr2Izm"
        )
        .catch((error) => {
          console.log(error);
        });
      navigate(`/my/profile/`);
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
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
            Send Key to A New User
          </Typography>
          <Box ref={form} component="form" onSubmit={sendEmail}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user_name"
              label="Name"
              name="user_name"
              autoComplete="user_name"
              autoFocus
            />
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            ></Box>
            <FormControl required fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value={"Team Admin"}>Team Admin</MenuItem>
                <MenuItem value={"TFF Admin"}>TFF Admin</MenuItem>
                <MenuItem value={"Lawyer"}>Lawyer</MenuItem>
              </Select>
            </FormControl>
            {role === "Team Admin" ? (
              <TextField
                margin="normal"
                required
                fullWidth
                id="team"
                label="Team Name"
                name="team"
                autoComplete="team"
                sx={{ mt: 3 }}
              />
            ) : (
              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              defaultValue={generate({ length: 23 })}
              margin="normal"
              required
              fullWidth
              name="key"
              label="Key"
              type="text"
              id="key"
              autoComplete="key"
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
                mt: 3,
                backgroundColor: "#51087E",
                "&:hover": {
                  backgroundColor: "#51087E",
                },
              }}
            >
              SEND KEY
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
