import {
  Alert,
  Avatar,
  Button,
  CssBaseline,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import FFP_API from "../../app/api";
import emailjs from "@emailjs/browser";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const theme = createTheme();

export default function RegisterTeamComponent() {
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  /**
   * This function will accept details about a team
   * delete the team from the database
   * and notify the admin of the team via email.
   *
   * @async
   * @function handleDeleteTeam
   * @param {string} teamName The team's full name
   * @param {string} teamAdmin The team admin's email
   * @param {string} teamID The team's id in the database
   * @throws Will throw an error if team deletion was not successful.
   * @throws Will throw an error if email sending was not successful.
   */
  const handleDeleteTeam = async (teamName, teamAdmin, teamID) => {
    if (teamAdmin) {
      var templateParams = {
        email: teamAdmin,
        teamName: teamName,
      };
      await emailjs
        .send(
          "service_6wdin2n",
          "delete_form",
          templateParams,
          "dJFhrGo-1Kr0IaXKq"
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    }

    try {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      await FFP_API.request(`/teams/${teamID}`, options);
      alert("You have successfully deleted the team! Page will be refreshed.");
      window.location.reload();
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await FFP_API.get("/teams/data").then((res) => {
        setTeams(res.data.teams);
      });
      setLoading(false);
    };
    if (loading) fetchData();
  });

  /**
   *
   * This function will accept details about a team
   * and display delete confirmation message.
   * Prompts the user one last time before deleting the team
   * and deletes or does not delete the team based on the user's response.
   *
   * @function submit
   * @param {string} teamName The team's full name
   * @param {string} admin The team admin's email
   * @param {string} id The team's id in the database
   */
  const submit = (teamName, admin, id) => {
    confirmAlert({
      title: "CONFIRM TO DELETE",
      message: "Are you sure to do delete " + teamName + "?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteTeam(teamName, admin, id),
        },
        {
          label: "No",
          //onClick: () => alert("Team has not been deleted!"),
        },
      ],
    });
  };

  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            m: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h3" sx={{ mt: 2 }}>
            DELETE TEAM
          </Typography>
        </Box>
      </Container>
      {!loading ? (
        teams.map((team) => {
          return !team ? (
            <CircularProgressComponent />
          ) : (
            <>
              <li key={team.teamName}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Container maxWidth="md">
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">{team.teamName} </Typography>
                      <Avatar
                        src={team.logoURL}
                        sx={{ mt: 2, width: 56, height: 56 }}
                      />
                      {e && (
                        <Alert variant="outlined" severity="error">
                          {errorMessage}
                        </Alert>
                      )}
                      <Button
                        onClick={() =>
                          submit(team.teamName, team.admin, team._id)
                        }
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
                        DELETE
                      </Button>
                    </Box>
                  </Container>
                </ThemeProvider>
              </li>
            </>
          );
        })
      ) : (
        <CircularProgressComponent />
      )}
    </>
  );
}
