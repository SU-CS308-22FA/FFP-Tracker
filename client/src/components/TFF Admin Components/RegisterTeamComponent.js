import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FFP_API from "../../app/api";

const theme = createTheme();

export default function RegisterTeamComponent() {
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validate = (data) => {
    let error = "";
    if (data.get("seasonBudget") <= 0) {
      error = "Season budget must be greater than 0.";
    }
    return error;
  };

  const handleNewTeam = async (e) => {
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
        const options = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        };
        await FFP_API.post(
          `/teams`,
          {
            teamName: data.get("teamName"),
            seasonBudget: data.get("seasonBudget"),
          },
          options
        );
        alert("Team created successfully!");
        navigate(`/my/profile`);
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data.error);
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
              Add A Team to the System
            </Typography>
            <Box component="form" onSubmit={handleNewTeam}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="teamName"
                    fullWidth
                    id="teamName"
                    label="Team Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="seasonBudget"
                    label="Season Budget"
                    name="seasonBudget"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }} />
              {e && (
                <Alert variant="outlined" severity="error" sx={{ mt: 1 }}>
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
                  backgroundColor: "#51087E",
                  "&:hover": {
                    backgroundColor: "#51087E",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
