import * as React from "react";
import { useRef } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FFP_API from "../app/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Alert } from "@mui/material";
//import { randomBytes } from "crypto";

import emailjs from "@emailjs/browser";
const theme = createTheme();
export default function SendKeyPage() {
  function generateRandomKey() {}
  const { user, setUser } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const form = useRef();
  const [role, setRole] = React.useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const sendEmail = async (e) => {
    e.preventDefault();

    await emailjs
      .sendForm(
        "service_rqfjoti",
        "contact_form",
        form.current,
        "TC_tgAG2yFIFr2Izm"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    const data = new FormData(e.currentTarget);

    try {
      if (role === "Team Admin") {
        await FFP_API.post("/register", {
          email: data.get("email"),
          key: data.get("key"),
          role: data.get("role"),
          team: data.get("team"),
        });
      } else {
        await FFP_API.post("/register", {
          email: data.get("email"),
          key: data.get("key"),
          role: data.get("role"),
        });
      }
      alert("Successfully key registered!");
      navigate(`/my/profile/${user._id}`);
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
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
                autoFocus
              />
            ) : (
              <></>
            )}
            {role !== "Team Admin" ? (
              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></Box>
            ) : (
              <></>
            )}

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
              sx={{ mt: 3, mb: 4 }}
            >
              SEND KEY
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
