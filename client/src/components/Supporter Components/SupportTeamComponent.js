import {
  Alert,
  Avatar,
  Button,
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
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
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import { optionUnstyledClasses } from "@mui/base";
import InformationComponent from "./InformationComponent";

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
export default function SupportTeamComponent() {
  const { user, setToken, setLogin, setUser } = useContext(UserContext);
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //const [budget, setBudget] = useState(["", ""]);
  const [budget, setBudget] = useState("");

  const handleUpdateTeam = async (team, amount) => {
    //e.preventDefault();
    const options = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    await FFP_API.patch(
      `/teams/${team._id}`,
      {
        sponsorBudget: amount,
      },
      options
    )
    .catch((err) => {
      setE(true);
      setErrorMessage(err.message);
    });
  };

  const handleSupportTeam = async (team, amount) => {
    if (amount === undefined || amount <= 0) {
      alert(
        "The season budget must be a positive number and cannot be left blank!"
      );
    } else {
      handleUpdateTeam(team, amount);
      try {
        await FFP_API.patch(`/users/${user._id}`, {
          team: team,
        });
        alert(
          "You have successfully requested supporting the team! The page will be refreshed."
        );
        window.location.reload();
      } catch (error) {
        setE(true);
        setErrorMessage(error.response.data);
      }
    }

    /*
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
    */
  };

  useEffect(() => {
    const fetchData = async () => {
      await FFP_API.get("/teams/data").then((res) => {
        setTeams(res.data.teams);
      });
      setLoading(false);
    };
    fetchData();
  }, [setTeams]);

  const submit = (teamName, admin, id) => {
    /*
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
    */
  };
  if (user.team) {
    return <InformationComponent></InformationComponent>;
  } else {
    return (
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
            <Container maxWidth="sm">
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
                      <StyledTableCell align="center">
                        Season Budget
                      </StyledTableCell>

                      <StyledTableCell align="center">Support</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teams !== null ? (
                      teams.map((team, index) => (
                        <StyledTableRow key={team.teamName}>
                          <StyledTableCell align="center">
                            {team.teamName}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Avatar src={team.logoURL} sx={{ ml: 6 }} />
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            <TextField
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              margin="normal"
                              fullWidth
                              id={team.teamName}
                              onChange={(e) => {
                                let newArr = [...budget];
                                newArr[index] = e.target.value;
                                setBudget(newArr);
                              }}
                              value={budget[index]}
                              label="budget"
                              name="budget"
                              required
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {" "}
                            <Button
                              onClick={() =>
                                handleSupportTeam(team, budget[index])
                              }
                              variant="contained"
                              color="success"
                            >
                              SUPPORT
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
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
    );
  }
}
/*
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


               {!loading ? (
        teams.map((team) => {
          return !team ? (
            <CircularProgressComponent />
          ) : (
            <>
              <Typography sx={{ mb: 2 }} variant="h4" component="h1">
                Categories
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="right">Team Name</StyledTableCell>
                      <StyledTableCell align="right">Avatar</StyledTableCell>

                      <StyledTableCell align="right">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      <StyledTableRow key={team.teamName}>
                        <StyledTableCell align="right">
                          {team.teamName}
                        </StyledTableCell>
                        <StyledTableCell align="right">{}</StyledTableCell>

                        <StyledTableCell align="right">
                          {" "}
                          <button
                            onClick={(e) => console.log("")}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </StyledTableCell>
                      </StyledTableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          );
        })
      ) : (
        <CircularProgressComponent />
      )}
              */
