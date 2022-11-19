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

import emailjs from "@emailjs/browser";
const theme = createTheme();
export default function SendKeyPage() {
  const form = useRef();
  const [role, setRole] = React.useState("");

  const handleChange = (event) => {
    console.log(role);
    setRole(event.target.value);
    console.log(role);
  };
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
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
                <MenuItem value={10}>Team Admin</MenuItem>
                <MenuItem value={20}>TFF Admin</MenuItem>
                <MenuItem value={30}>Lawyer</MenuItem>
              </Select>
            </FormControl>
            {role === 10 ? (
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
            {role !== 10 ? (
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
              id="user_email"
              label="Email Address"
              name="user_email"
              autoComplete="user_email"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label="Key"
              type="text"
              id="message"
              autoComplete="message"
            />

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
