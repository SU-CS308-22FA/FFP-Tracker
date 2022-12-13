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
import { client } from "filestack-react";
import FFP_API from "../../app/api";
import { useEffect } from "react";

const theme = createTheme();

export default function FileSubmitComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    fetchUsers();
  }, [setUsers]);

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

  const getLawyers = () => {
    if (users) {
      let lawyers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "Lawyer") {
          lawyers.push(users[i]._id);
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
    }).catch((error) => {
      setE(true);
      setErrorMessage("Error creating notification Error:" + error);
    });
  }

  function sendNotificationToTFFAdmins() {
    const tffAdmins = getTFFAdmins();
    for (let i = 0; i < tffAdmins.length; i++) {
      createNotification(
        user._id,
        tffAdmins[i]._id,
        "File Submission",
        "A file has been submitted for review by " + user.fullname
      );
    }
  }

  function sendNotificationToLawyers() {
    const lawyers = getLawyers();
    for (let i = 0; i < lawyers.length; i++) {
      createNotification(
        user._id,
        lawyers[i],
        "File Submission",
        "A file has been submitted for review by " + user.fullname
      );
    }
  }

  function sendNotificationToUser() {
    createNotification(
      user._id,
      user._id,
      "File Submission",
      "Your file has been submitted for review."
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setE(false);
    setErrorMessage("");
    const data = new FormData(event.currentTarget);
    if (!user?.team) {
      setE(true);
      setErrorMessage("You are not part of a team");
    } else if (selectedFile === null) {
      setE(true);
      setErrorMessage("You have to upload a file!");
    } else if (date > new Date().toISOString().substring(0, 10)) {
      setE(true);
      setErrorMessage("Date cannot be in the future!");
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
        await FFP_API.post(`/files/team/${user.team}`, {
          file: selectedFile,
          submitDate: date,
        });
        alert("Successfully submitted!");
        sendNotificationToTFFAdmins();
        sendNotificationToUser();
        sendNotificationToLawyers();
        navigate(`/my/profile/`);
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data.error);
      }
    }
  };

  const handleFilePicker = () => {
    const filestackApikey = "AJ72c4DJLSPqnTctAvQ0wz"; //insert here with your own api key
    const filestack = client.init(filestackApikey);
    const options = {
      onFileUploadFinished(file) {
        setSelectedFile(file.url);
      },
    };
    const picker = filestack.picker(options);
    picker.open();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h3" sx={{}}>
              File Submission
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {selectedFile ? (
                <>
                  <Typography component="h2" variant="h5" sx={{ mt: 2, mb: 2 }}>
                    Uploaded File:{" "}
                    <Button href={selectedFile} target="_blank">
                      Click here to view file
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ ml: 2 }}
                      onClick={handleRemoveFile}
                    >
                      Remove File
                    </Button>
                  </Typography>
                  <Container maxWidth="sm"></Container>
                </>
              ) : (
                <Button
                  onClick={handleFilePicker}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Pick a file to Upload
                </Button>
              )}

              <Typography component="h2" variant="h5">
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
                Expenses
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
                Date of Submission
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
                <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
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
