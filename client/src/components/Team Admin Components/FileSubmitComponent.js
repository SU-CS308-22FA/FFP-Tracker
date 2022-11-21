import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import FileUploadComponent from "./FileUploadComponent";
import FFP_API from "../../app/api";

const theme = createTheme();

export default function FileSubmitComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await FFP_API.patch(`/revenues/${user.team}`, {
        ticketing: data.get("Ticketing"),
        marketing: data.get("Marketing"),
        broadcasting: data.get("Broadcasting"),
        month: date.substring(0, 7),
      });
      await FFP_API.patch(`/expenses/${user.team}`, {
        salaries: data.get("Salaries"),
        amortization: data.get("Amortization"),
        operational: data.get("Operational"),
        month: date.substring(0, 7),
      });

      alert("Successfully submitted!");
      navigate(`/my/profile/`);
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

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
