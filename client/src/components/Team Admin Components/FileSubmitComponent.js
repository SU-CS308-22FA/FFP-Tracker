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
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);

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
    const fetchRevenues = async () => {
      const response = await FFP_API.get(`/revenues`);
      setRevenues(response.data);
    };
    const fetchExpenses = async () => {
      const response = await FFP_API.get(`/expenses`);
      setExpenses(response.data);
    };
    fetchExpenses();
    fetchRevenues();
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


  // send notification to user about submitted file
  function sendNotificationToUser() {
    try {
	    createNotification(
        user._id,
        user._id,
        "File Submission",
        "Your file has been submitted for review."
	    );
	    console.log("succesfully submitted file notification is sent");
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage("Error sending notification to user Error:" + error);
      }
  }

  function returnLastValueOfObject(obj) {
    return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
  }

  // get all expenses for users team
  const getExpenses = () => {
    if (expenses) {
      let teamExpenses = [];
      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].teamId === user.team) {
          teamExpenses.push(expenses[i]);
        }
      }
      return teamExpenses;
    }
  };

  // get total of all expenses for users team
  const TotalExpenses = () => {
    var total = 0;
    const teamExpenses = getExpenses();
    for (let i = 0; i < teamExpenses.length; i++) {
      total += returnLastValueOfObject(teamExpenses[i].salaries);
      total += returnLastValueOfObject(teamExpenses[i].amortization);
      total += returnLastValueOfObject(teamExpenses[i].operational);
    }
    return total;
  };

  // get all revenues for users team
  const getRevenues = () => {
    if (revenues) {
      let teamRevenues = [];
      for (let i = 0; i < revenues.length; i++) {
        if (revenues[i].teamId === user.team) {
          teamRevenues.push(revenues[i]);
        }
      }
      return teamRevenues;
    }
  };

    // get total of all revenues for users team
    const TotalRevenues = () => {
      var total = 0;
      const teamRevenues = getRevenues();
      for (let i = 0; i < teamRevenues.length; i++) {
        total += returnLastValueOfObject(teamRevenues[i].ticketing);
        total += returnLastValueOfObject(teamRevenues[i].marketing);
        total += returnLastValueOfObject(teamRevenues[i].broadcasting);
      }
      console.log("Total Revenues is:" + total);
      return total;
    };


    const NetSpend = () => {
      console.log("Net Spend is:" + TotalExpenses() - TotalRevenues());
      return TotalExpenses() - TotalRevenues();
    };

    // get all users with role of Team Admin and team of users team
    const getTeamAdmins = () => {
      if (users) {
        let teamAdmins = [];
        for (let i = 0; i < users.length; i++) {
          if (users[i].role === "Team Admin" && users[i].team === user.team) {
            teamAdmins.push(users[i]);
          }
        }
        return teamAdmins;
      }
    };


    // send notification to user if net spend is positive
    function sendNotificationToUserIfNetSpendIsPositive() {
      if (NetSpend() > 0) {
        try {
          // send notification to all team admins of users team
          const teamAdmins = getTeamAdmins();
          for (let i = 0; i < teamAdmins.length; i++) {
            createNotification(
              user._id,
              teamAdmins[i]._id,
              "Net Spend",
              "Your net spend is: " + NetSpend() + "Mil. TL. " + "Please check your expenses"
            );
          }
          console.log("succesfully sent positive net spend notification to user");
        } catch (error) {
          console.log(error);
          setE(true);
          setErrorMessage("Error sending positive net spend notification to user Error:" + error);
        }
      }
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
        sendNotificationToUserIfNetSpendIsPositive();
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
