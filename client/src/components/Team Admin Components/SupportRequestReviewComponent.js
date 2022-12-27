import {
  Alert,
  Avatar,
  Button,
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
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
//import InformationComponent from "./InformationComponent";

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
export default function SupportRequestReviewComponent() {
  const { user, setToken, setLogin, setUser } = useContext(UserContext);
  const [users, setUsers] = useState(null);
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //const [budget, setBudget] = useState(["", ""]);
  const [budget, setBudget] = useState("");

  const handleUpdateTeam = async (team) => {
    //e.preventDefault();
    const options = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    await FFP_API.patch(
      `/teams/${team._id}`,
      {
        sponsorBudget: 0,
      },
      options
    ).catch((err) => {
      setE(true);
      setErrorMessage(err.message);
    });
  };

  const handleDenySupport = async (User) => {
    let userTeam = teamFinder(User);
    handleUpdateTeam(userTeam);
    try {
      await FFP_API.patch(`/users/${User._id}`, {
        team: null,
        rejectedTeams: userTeam._id,

        //{ team_id: userTeam._id },
      });
      alert(
        "You have successfully rejected the request! The page will be refreshed."
      );
      window.location.reload();
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

  const handleApproveSupport = async (User) => {
    let userTeam = teamFinder(User);
    //handleUpdateTeam2(userTeam);
    try {
      await FFP_API.patch(`/users/${User._id}`, {
        isSupporting: true,
      });
      alert(
        "You have successfully approved the request! The page will be refreshed."
      );
      window.location.reload();
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

  useEffect(() => {
    /*
    const options = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    */
    const fetchData = async () => {
      await FFP_API.get("/teams/data").then((res) => {
        setTeams(res.data.teams);
      });
      setLoading(false);
    };
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };

    fetchData();
    fetchUsers();
  }, [setTeams, setUsers]);

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
  function teamFinder(user) {
    let index1 = -1;
    for (let i = 0; i < teams.length; i++) {
      if (teams[i]._id === user.team) {
        index1 = i;
        break;
      }
    }
    const userTeam = teams[index1];

    return userTeam;
  }

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
              Requests
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Supporter Name
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Budget Offering(Mil. TL)
                    </StyledTableCell>

                    <StyledTableCell align="center">Decision</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users !== null && teams !== null && user !== null ? (
                    users.map((user1, index) =>
                      user1.role === "Supporter" &&
                      teamFinder(user1) &&
                      user.team === user1.team &&
                      user1.isSupporting === false ? (
                        <StyledTableRow key={user1.fullname}>
                          <StyledTableCell align="center">
                            {user1.fullname}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {teamFinder(user1)
                              ? teamFinder(user1).sponsorBudget !== 0
                                ? teamFinder(user1).sponsorBudget
                                : ""
                              : ""}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            <IconButton
                              aria-label="approve"
                              color="success"
                              onClick={() => handleApproveSupport(user1)}
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="reject"
                              color="error"
                              onClick={() => handleDenySupport(user1)}
                            >
                              <BlockIcon />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ) : null
                    )
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
