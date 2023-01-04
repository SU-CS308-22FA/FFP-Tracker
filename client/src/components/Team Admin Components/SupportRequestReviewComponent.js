import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
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
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState(null);
  const [teams, setTeams] = useState(null);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateTeam = async (team) => {
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
    const fetchData = async () => {
      await FFP_API.get("/teams/data").then((res) => {
        setTeams(res.data.teams);
      });
    };
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };

    fetchData();
    fetchUsers();
  }, [setTeams, setUsers]);

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
          }}
        >
          <Container maxWidth="sm">
            <Typography
              sx={{ mt: 4, mb: 2 }}
              variant="h4"
              component="h1"
              align="center"
            >
              Current Requests
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
