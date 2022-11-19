import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FFP_API from "../app/api";
import { UserContext } from "../contexts/userContext";
import FileUploadComponent from "./FileUploadComponent";
import { useContext } from "react";

const theme = createTheme();
export default function FileSubmitComponent() {
  const { user, setUser } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {};

  return (
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
            <Box component="form" onSubmit={handleSubmit}>
              <FileUploadComponent />
              <Typography component="h1" variant="h5">
                Revenues
              </Typography>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Ticketing"
                label="Ticketing"
                name="Ticketing"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Marketing"
                label="Marketing"
                name="Marketing"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Broadcasting"
                label="Broadcasting"
                name="Broadcasting"
                required
              />
              <Box
                sx={{
                  marginTop: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></Box>
              <Typography component="h1" variant="h5">
                EXPENSES
              </Typography>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Salaries"
                label="Salaries"
                name="Salaries"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Amortization"
                label="Amortization"
                name="Amortization"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                name="Operational"
                label="Operational"
                id="Operational"
                required
              />
              <Box
                sx={{
                  marginTop: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></Box>
              <Typography component="h1" variant="h5">
                DATE
              </Typography>
              <TextField
                margin="normal"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                id="date"
                name="date"
                className="form-control"
                type="date"
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
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
