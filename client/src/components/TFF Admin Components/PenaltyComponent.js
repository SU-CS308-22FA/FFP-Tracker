import { Typography, Container, Paper, Card } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useEffect, useState, useContext, Fragment } from "react";
import FFP_API from "../../app/api";
import { UserContext } from "../../contexts/userContext";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import IconButton from "@mui/material/IconButton";
import WarningIcon from "@mui/icons-material/Warning";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";

const theme = createTheme();

export default function PenaltyComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [penalties, setPenalties] = useState({});

  const handlePenaltyChange = (event, teamName) => {
    setPenalties({ ...penalties, [teamName]: event.target.value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    const fetchRevenues = async () => {
      const response = await FFP_API.get(`/revenues`);
      setRevenues(response.data);
    };
    const fetchExpenses = async () => {
      const response = await FFP_API.get(`/expenses`);
      setExpenses(response.data);
    };
    const fetchFiles = async () => {
      const response = await FFP_API.get(`/files`);
      setFiles(response.data);
    };
    const fetchTeams = async () => {
      const response = await FFP_API.get(`/teams`);
      setTeams(response.data);
    };
    fetchExpenses();
    fetchRevenues();
    fetchUsers();
    fetchFiles();
    fetchTeams();
  }, [setUsers, setRevenues, setExpenses, setFiles, setTeams]);

  // get current budget of team by id
  const getTeamBudget = (teamId) => {
    // get team by id and return current budget
    return teams.filter((team) => team._id === teamId)[0].currentBudget;
  };

  // get teamadmins by team id
  const getTeamAdmins = (teamId) => {
    // itearate through users and return team admins
    let teamAdmins = [];
    users.forEach((user) => {
      if (user.team === teamId && user.role === "Team Admin") {
        teamAdmins.push(user);
      }
    });
    return teamAdmins;
  };

  // create notification
  async function createNotification(receiver, subject, message) {
    console.log("creating notification");
    console.log("Sender: ", user._id);
    console.log("Receiver: ", receiver);
    console.log("Subject: ", subject);
    console.log("Message: ", message);

    await FFP_API.post("/notifications", {
      sender: user._id,
      receiver: receiver,
      subject: subject,
      message: message,
    })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        setE(true);
        setErrorMessage("Error creating notification");
      });
  }

  // find team id by name
  const findTeamId = (teamName) => {
    // check if teamName exists in teams
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].teamName === teamName) {
        return teams[i]._id;
      }
    }
    // console.log(teams.filter(team => team.teamName === teamName)[0]._id);
    // return teams.filter(team => team.teamName === teamName)[0]._id;
  };

  const findNotSubmittedTeams = () => {
    // console.log("a");
    // console.log(teams);

    let notSubmittedTeams = {}; // object to store teams that have not submitted files
    teams.forEach((team) => {
      //const lastFile = files.filter(file => findTeamId(file.teamName) === team._id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      //console.log(lastFile);
      //console.log(team);
      // iterate through files and find the last file submitted by the team
      let fileArray = {};
      files.forEach((file) => {
        if (file.teamName === team.teamName) {
          // add the String(file.submitDate.substring(0, 7)) to file array as a key and the file as the value
          fileArray[String(file.submitDate.substring(0, 7))] = file;

          // fileArray.push(file);
          // fileMonths.push(String(file.submitDate.substring(0, 7)));
        }
      });
      //console.log(fileArray);
      let fileMonths = Object.keys(fileArray);
      //console.log(fileMonths);

      fileMonths.sort((a, b) => {
        const aYear = Number(a.slice(0, 4));
        const bYear = Number(b.slice(0, 4));
        const aMonth = Number(a.slice(5, 7));
        const bMonth = Number(b.slice(5, 7));
        if (aYear === bYear) {
          return aMonth - bMonth;
        } else {
          return aYear - bYear;
        }
      });
      //console.log(fileMonths);
      let sortedFiles = {};
      for (let i = 0; i < fileMonths.length; i++) {
        //sortedFiles.push(fileArray[fileMonths[i]]);
        sortedFiles[fileMonths[i]] = fileArray[fileMonths[i]];
      }
      //console.log("For Team:", team.teamName, " sorted Files:" ,sortedFiles);

      // find the last file submitted by the team
      const lastFile = sortedFiles[fileMonths[fileMonths.length - 1]];
      //console.log("lastFile:", lastFile);

      // find the last month that the team submitted a file
      const lastMonth = fileMonths[fileMonths.length - 1];
      //console.log("fileMOnths", fileMonths);

      // find the current month
      const currentMonth = new Date().toISOString().slice(0, 7);

      // check if the last month that the team submitted a file is the current month
      //console.log("Team:",team.teamName, "lastMonth:", lastMonth, "currentMonth:", currentMonth);
      // if last month is undefined
      if (lastMonth === undefined) {
        //console.log("No files submitted for team:", team.teamName, "");
        notSubmittedTeams[team.teamName] = "No files submitted";
        //console.log(notSubmittedTeams);
      } else if (lastMonth !== currentMonth) {
        // if the last month is not the current month, add the team to the notSubmittedTeams object
        //console.log("Team:", team.teamName, "did not submit a file last month");
        notSubmittedTeams[team.teamName] = lastMonth;
      }
    });

    //console.log("Not Submitted Teams are:",notSubmittedTeams);
    return notSubmittedTeams;
  };

  // handle the click event of the send penalty button
  const handleSendPenalty = (teamName, penalty) => {
    console.log("Team:", teamName, "Penalty:", penalty);
    // check if penalty is a number
    if (isNaN(penalty)) {
      alert("Penalty must be a number");
      return;
    } else if (penalty <= 0) {
      alert("Penalty must be a positive number");
      return;
    } else {
      // send the penalty to the team
      // find the team id
      const teamId = findTeamId(teamName);
      //console.log("TeamId:", teamId);
      // find the team's current balance
      //const teamBudget = teams.filter(team => team._id === teamId)[0].currentBudget;
      const teamBudget = getTeamBudget(teamId);

      //console.log("Team Balance:", teamBudget);
      // subtract the penalty from the team's balance
      const newBalance = teamBudget - penalty;
      //console.log("New Balance:", newBalance);
      // update the team's balance
      FFP_API.put(`/teams/${teamId}`, { currentBudget: newBalance });
      // update the penalties object
      setPenalties((prevPenalties) => {
        return {
          ...prevPenalties,
          [teamName]: 0,
        };
      });
      // send notification to the teamAdmins of the team
      const teamAdmins = getTeamAdmins(teamId);
      console.log("Team Admins:", teamAdmins);
      teamAdmins.forEach((teamAdmin) => {
        console.log("Team Admin:", teamAdmin);
        createNotification(
          teamAdmin,
          "Penalty",
          `You have been penalized ${penalty} M TL by ${user.fullname}, for not submitting your files last month`
        );
      });

      // reload the page
      alert("Penalty sent successfully");
      window.location.reload();
    }
  };

  // display the list of teams that did not submit their files last month, also have a button to send penalty to the team
  const displayNotSubmittedTeams = () => {
    const notSubmittedTeams = findNotSubmittedTeams();
    const teamNames = Object.keys(notSubmittedTeams);
    return teamNames.map((teamName) => {
      return (
        <ListItem key={teamName}>
          <Card
            style={{
              width: "100%",
              maxWidth: 500,
              backgroundColor: theme.palette.background.paper,
            }}
            sx={{ p: 1 }}
          >
            <ListItemText
              primary={teamName}
              secondary={
                "Last File Submission: " +
                notSubmittedTeams[teamName] +
                " -- Current Budget: " +
                getTeamBudget(findTeamId(teamName))
              }
            />
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSendPenalty(teamName, penalties[teamName]);
              }}
            >
              <FormControl>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h" mr={8}>
                    Penalty Fee:
                  </Typography>
                  <Input
                    value={penalties[teamName] || ""}
                    onChange={(event) => handlePenaltyChange(event, teamName)}
                    endAdornment={
                      <InputAdornment position="start">Mil. TL</InputAdornment>
                    }
                  />
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="sendPenalty"
                      onClick={() =>
                        handleSendPenalty(teamName, penalties[teamName])
                      }
                    >
                      <WarningIcon />
                    </IconButton>
                  </InputAdornment>
                </div>
              </FormControl>
            </form>
          </Card>
        </ListItem>
      );
    });
  };

  const displayNotSubmittedTeamsList = () => {
    return (
      <List
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: theme.palette.background.paper,
        }}
        sx={{
          mb: 4,
        }}
      >
        <Paper>{displayNotSubmittedTeams()}</Paper>
      </List>
    );
  };

  // show not submitted teams list in the center of the page
  return !teams ? (
    <CircularProgressComponent />
  ) : (
    <>
      <Typography variant="h4" gutterBottom align="center" mt={4}>
        Teams That Did Not Submit Their Files Last Month
      </Typography>
      <Container maxWidth="sm">{displayNotSubmittedTeamsList()}</Container>
    </>
  );
}
