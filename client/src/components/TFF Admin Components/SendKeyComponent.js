import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { useRef, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FFP_API from "../../app/api";
import { generate } from "@wcj/generate-password";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
    setE(false);
    e.preventDefault();
    if (role === "Team Admin") {
      if (selectedTeam === "") {
        setE(true);
        setErrorMessage("Please select a team!");
        return;
      }
    }
    if (EMAIL_REGEX.test(e.currentTarget.email.value) === false) {
      setE(true);
      setErrorMessage("Please enter a valid email!");
      return;
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
                <MenuItem value={"Supporter"}>Supporter</MenuItem>
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
              sx={{ mt: 3 }}
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
