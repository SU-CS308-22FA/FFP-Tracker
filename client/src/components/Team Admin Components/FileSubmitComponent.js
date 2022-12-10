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
import { useEffect } from "react";

const theme = createTheme();

export default function FileSubmitComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState(null);
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      const response = await FFP_API.get(`/notifications`);
      setNotification(response.data);
    };
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    const fetchTeams = async () => {
      const response = await FFP_API.get(`/teams`);
      setTeams(response.data);
    };
    fetchUsers();
    fetchNotification();
    fetchTeams();
  }, [setNotification, setUsers, setTeams]);

  const navigate = useNavigate();

  // get list of all users with role of TFF Admin
  const getTFFAdmins = () => {
    if (users) {
      let tffAdmins = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "TFF Admin") {
          tffAdmins.push(users[i]);
        }
      }
      return tffAdmins;
    }
  };

  // get list of all users with role of Lawyer
  const getLawyers = () => {
    if (users) {
      let lawyers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "Lawyer") {
          lawyers.push(users[i]);
        }
      }
      return lawyers;
    }
  };


  // create notification function
  async function createNotification(sender, receiver, subject, message) {
    await FFP_API.post(`/notifications`, {
      sender: sender,
      receiver: receiver,
      subject: subject,
      message: message,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setE(true);
        setErrorMessage("Error creating notification Error:" + error);
      });
  }

  // send notification about submitted file, to all TFF Admins
  function sendNotificationToTFFAdmins() {
    const tffAdmins = getTFFAdmins();
    try {
      for (let i = 0; i < tffAdmins.length; i++) {
        createNotification(
          user._id,
          tffAdmins[i]._id,
          "File Submission",
          "A file has been submitted for review by " + user.fullname
        );
      }
      console.log("succesfully send Notification To TFFAdmins");
    } 
    catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage("Error sending notification to TFF Admins Error:" + error);
    }
  }

  // send notification to all Lawyers
  function sendNotificationToLawyers() {
    const lawyers = getLawyers();
    try{
      for (let i = 0; i < lawyers.length; i++) {
        createNotification(
          user._id,
          lawyers[i]._id,
          "File Submission",
          "A file has been submitted for review by " + user.fullname
        );
      }
      console.log("succesfully send Notification To Lawyers");
    } 
    catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage("Error sending notification to lawyers Error:" + error);
    }
  }



  function sendNotificationToUser() {
    createNotification(
      user._id,
      user._id,
      "File Submission",
      "Your file has been submitted for review."
    );
    console.log("succesfully submitted file notification is sent");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!user?.team) {
      setE(true);
      setErrorMessage("You are not part of a team");
    } else {
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
        sendNotificationToTFFAdmins();
        sendNotificationToLawyers();
        sendNotificationToUser();
        navigate(`/my/profile/`);
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data);
      }
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
