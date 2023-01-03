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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

const theme = createTheme();

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
        },
      ],
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="md">
              <Box sx={{ mt: 3 }}></Box>
              <Typography sx={{ mb: 2 }} variant="h4" component="h1">
                Teams
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        Team Name
                      </StyledTableCell>
                      <StyledTableCell align="center">Logo</StyledTableCell>

                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading ? (
                      teams.map((team) => {
                        return !team ? (
                          <CircularProgressComponent />
                        ) : (
                          <>
                            <StyledTableRow key={team.teamName}>
                              <StyledTableCell align="center">
                                {team.teamName}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Avatar src={team.logoURL} sx={{ ml: 15 }} />
                              </StyledTableCell>

                              <StyledTableCell align="center">
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
                              </StyledTableCell>
                            </StyledTableRow>
                          </>
                        );
                      })
                    ) : (
                      <Container sx={{ ml: 15 }}>
                        <CircularProgressComponent></CircularProgressComponent>
                      </Container>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
            <Box sx={{ mt: 3 }}></Box>
            {e && (
              <Alert variant="outlined" severity="error">
                {errorMessage}
              </Alert>
            )}
          </Box>
        </main>
      </ThemeProvider>
    </>
  );
}
