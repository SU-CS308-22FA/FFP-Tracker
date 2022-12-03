import {
  Alert,
  Avatar,
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

export default function EditTeamComponent() {
  const theme = createTheme();
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validate = (data) => {
    setE(false);
    setErrorMessage("");
    let error = "";
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // const result = validate(data);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box
            sx={{
              m: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
              Update Your Team's Information
            </Typography>
            <Typography>Your Team is Galatasaray.</Typography>
            <Box component="form" onSubmit={handleSubmit} alignItems="center">
              <Grid container spacing={2}>
                <Container>
                  <Avatar />
                </Container>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    id="wikiLink"
                    label="Wikipedia Link"
                    name="wikiLink"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="manager"
                    label="Manager Name"
                    name="manager"
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
                Update Team
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
