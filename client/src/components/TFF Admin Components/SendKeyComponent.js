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
  Autocomplete,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FFP_API from "../../app/api";
import { generate } from "@wcj/generate-password";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SendKeyComponent() {
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const form = useRef();
  const [role, setRole] = useState("");
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const getTeams = async () => {
      const options = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      const res = await FFP_API.get("/teams", options);
      const allTeams = res.data;
      const filteredTeams = allTeams.filter((team) => {
        return team.admin === null || team.admin === "";
      });
      setTeams(filteredTeams);
    };
    getTeams();
  }, []);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (role === "Team Admin") {
      if (selectedTeam === "") {
        setE(true);
        setErrorMessage("Please select a team!");
        return;
      }
    }
    const data = new FormData(e.currentTarget);
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      if (role === "Team Admin") {
        await FFP_API.post(
          "/register",
          {
            email: data.get("email"),
            key: data.get("key"),
            role: role,
            team: selectedTeam,
          },
          options
        );
      } else {
        await FFP_API.post(
          "/register",
          {
            email: data.get("email"),
            key: data.get("key"),
            role: role,
          },
          options
        );
      }
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
      alert("Key sent successfully!");
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
            <FormControl required fullWidth sx={{ mt: 2 }}>
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
              <Autocomplete
                clearOnEscape
                freeSolo
                options={teams}
                sx={{ mt: 2 }}
                getOptionLabel={(option) => option.teamName}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setSelectedTeam(newValue.teamName);
                  } else {
                    setSelectedTeam("");
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Team Name" />
                )}
              />
            ) : null}
            <TextField
              sx={{ mt: 3}}
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
              sx={{ mt: 2 }}
              required
              fullWidth
              name="key"
              label="Key"
              type="text"
              id="key"
              autoComplete="key"
            />
            {e && (
              <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
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
