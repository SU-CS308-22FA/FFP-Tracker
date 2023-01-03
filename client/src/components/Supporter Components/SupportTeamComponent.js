import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import FFP_API from "../../app/api";
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
  const { user } = useContext(UserContext);
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [budget, setBudget] = useState("");

  rejectedTeamsFinder();

  const handleUpdateTeam = async (team, amount) => {
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
    ).catch((err) => {
      setE(true);
      setErrorMessage(err.message);
    });
  };

  const handleSupportTeam = async (team, amount) => {
    if (amount === undefined) {
      alert("The season budget cannot be left blank!");
    } else if (amount <= 0) {
      alert("The season budget must be a positive number!");
    } else if (isNaN(amount)) {
      alert("The season budget must be a number!");
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

  function rejectedTeamsFinder(teamid) {
    let arr = user.rejectedTeams;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === teamid) {
        return true;
      }
    }
    return false;
  }

  if (user.team) {
    return <InformationComponent />;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Container maxWidth="md">
            <Typography
              sx={{ mt: 2, mb: 4 }}
              variant="h3"
              component="h1"
              align="center"
            >
              Request to Support a Team
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Team Name</StyledTableCell>
                    <StyledTableCell align="center">Logo</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">
                      Season Budget (Mil. TL)
                    </StyledTableCell>
                    <StyledTableCell align="center">Support</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams !== null ? (
                    teams.map((team, index) => {
                      if (team.sponsorBudget === 0) {
                        return (
                          <StyledTableRow key={team.teamName}>
                            <StyledTableCell align="center">
                              {team.teamName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Avatar src={team.logoURL} sx={{ ml: 3 }} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {rejectedTeamsFinder(team._id)
                                ? "Rejected"
                                : "Applicable"}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <TextField
                                disabled={
                                  rejectedTeamsFinder(team._id) ? true : false
                                }
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
                                label="Budget"
                                name="budget"
                                required
                              />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                disabled={
                                  rejectedTeamsFinder(team._id) ? true : false
                                }
                                onClick={() =>
                                  handleSupportTeam(team, budget[index])
                                }
                                variant="contained"
                                color="success"
                              >
                                Request
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      }
                    })
                  ) : (
                    <Container sx={{ ml: 15 }}>
                      <CircularProgressComponent />
                    </Container>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
          {e && (
            <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </main>
      </ThemeProvider>
    );
  }
}
