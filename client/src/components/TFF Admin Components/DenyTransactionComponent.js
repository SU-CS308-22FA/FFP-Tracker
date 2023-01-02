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

export default function DenyTransactionComponent() {
  const currentDate = new Date();
  let todaymonth = currentDate.getMonth() + 1;
  todaymonth = todaymonth.toString();
  let todayyear = currentDate.getFullYear();
  todayyear = todayyear.toString();

  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let lastDate = "";
  let lastRevenueTicketing = 0.0;
  let lastRevenueMarketing = 0.0;
  let lastRevenueBroadCasting = 0.0;
  let lastExpenseSalary = 0.0;
  let lastExpenseAmortization = 0.0;
  let lastExpenseOperational = 0.0;

  /**
   * This function will accept details about a team
   * delete its revenue & expense from the database
   * and notify the admin of the team via email.
   *
   * @async
   * @function handleDeleteRevenueExpense
   * @param {string} teamName The team's full name
   * @param {string} teamAdmin The team admin's email
   * @param {string} teamID The team's id in the database
   * @throws Will throw an error if revenue&expense deletion was not successful.
   * @throws Will throw an error if email sending was not successful.
   */
  const handleDeleteRevenueExpense = async (teamName, teamAdmin, teamID) => {
    if (teamAdmin) {
      var templateParams = {
        email: teamAdmin,
        teamName: teamName,
        date: lastDate,
      };
      await emailjs
        .send(
          "service_rqfjoti",
          "deny_form",
          templateParams,
          "TC_tgAG2yFIFr2Izm"
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
      await FFP_API.request(`/revenues/${teamID}`, options);
      await FFP_API.request(`/expenses/${teamID}`, options);
      alert(
        "You have successfully denied the transaction! Page will be refreshed."
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
        setRevenues(res.data.revenues);
        setExpenses(res.data.expenses);
      });

      setLoading(false);
    };
    if (loading) fetchData();
  });

  /**
   * This function will retrieve all the teams, revenues,
   * and expenses from the fetched data, matches the teams to their revenues and expenses,
   * and returns a list of their recent transactions.
   *
   * @function revenueExpenseFinder
   * @param {Object} team The team object
   * @param {Object} revenues The revenue object
   * @param {Object} expenses The expense object
   * @returns {Array} The team's last revenues, last expenses and date of last submission
   */
  function revenueExpenseFinder(team, revenues, expenses) {
    let index1 = -1;
    for (let i = 0; i < revenues.length; i++) {
      if (revenues[i].teamId === team._id) {
        index1 = i;
        break;
      }
    }
    const revs = revenues[index1];
    let index2 = -1;
    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].teamId === team._id) {
        index2 = i;
        break;
      }
    }
    const exps = expenses[index2];

    lastDate = "";
    lastRevenueTicketing = 0.0;
    lastRevenueMarketing = 0.0;
    lastRevenueBroadCasting = 0.0;
    lastExpenseSalary = 0.0;
    lastExpenseAmortization = 0.0;
    lastExpenseOperational = 0.0;
    if (revs || exps) {
      for (const [key, value] of Object.entries(revs.ticketing)) {
        if (String(key) > lastDate) {
          lastDate = String(key);
          lastRevenueTicketing = value;
          lastRevenueMarketing = revs.marketing[key];
          lastRevenueBroadCasting = revs.broadcasting[key];
        }
      }

      for (const [key, value] of Object.entries(exps.salaries)) {
        lastExpenseSalary = value;
        lastExpenseAmortization = exps.amortization[key];
        lastExpenseOperational = exps.operational[key];
      }
    }
    /*
    const dateParts = lastDate.split("-");
    let year = "";
    let month = "";
    if (dateParts.length !== 1) {
      year = dateParts[0];
      month = dateParts[1];
      console.log("evet", todayyear, year);
      if (year === todayyear) {
        if (todaymonth - month >= 2) {
          //console.log("----", todaymonth, month);
          lastDate = "a";
        }
      } else if (year !== todayyear) {
        console.log("aaaaaaa", year, todayyear);
        lastDate = "a";
      }
    }
    */

    return [
      lastDate,
      lastRevenueTicketing,
      lastRevenueMarketing,
      lastRevenueBroadCasting,
      lastExpenseSalary,
      lastExpenseAmortization,
      lastExpenseOperational,
    ];
  }

  /**
   *
   * This function will accept details about a team
   * and display deny transaction(revenue&expense submission) confirmation message.
   * Prompts the user one last time before denying the team's transaction
   * and deletes or does not delete the transaction based on the user's response.
   *
   * @function submit
   * @param {string} teamName The team's full name
   * @param {string} admin The team admin's email
   * @param {string} id The team's id in the database
   */
  const submit = (teamName, admin, id) => {
    confirmAlert({
      title: "CONFIRM TO DENY",
      message: "Are you sure to do deny " + teamName + "'s last transaction?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteRevenueExpense(teamName, admin, id),
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
          <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
            DENY TRANSACTION
          </Typography>
        </Box>
      </Container>
      {!loading ? (
        teams.map((team) => {
          if (team) {
            let values = revenueExpenseFinder(team, revenues, expenses);

            lastDate = values[0];
            lastRevenueTicketing = values[1];
            lastRevenueMarketing = values[2];
            lastRevenueBroadCasting = values[3];
            lastExpenseSalary = values[4];
            lastExpenseAmortization = values[5];
            lastExpenseOperational = values[6];

            if (lastDate !== "") {
              const dateParts = lastDate.split("-");
              let year = dateParts[0];
              let month = dateParts[1];
              if (year === todayyear) {
                console.log(year, todayyear);
                if (todaymonth - month >= 2) {
                  lastDate = "a";
                }
              } else {
                lastDate = "a";
              }
            }
          }

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
                        m: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={team.logoURL}
                        sx={{ mt: 2, mb: 2, width: 56, height: 56 }}
                      />
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Team is {team.teamName}{" "}
                      </Typography>
                      {lastDate ? (
                        <>
                          {lastDate === "a" ? (
                            <Box>
                              <Typography variant="h6">
                                There is no revenue & expense record for the
                                current year or within the past month.
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              <Typography variant="h6">
                                Last submit date is {lastDate}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last ticketing revenue is {lastRevenueTicketing}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last marketing revenue is {lastRevenueMarketing}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last broadcasting revenue is{" "}
                                {lastRevenueBroadCasting}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last salary expense is {lastExpenseSalary}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last amortizational expense is{" "}
                                {lastExpenseAmortization}{" "}
                              </Typography>
                              <Typography variant="h6">
                                Last operational expense is{" "}
                                {lastExpenseOperational}{" "}
                              </Typography>
                            </>
                          )}
                        </>
                      ) : (
                        <Typography variant="h6">
                          There is no record for Revenues & Expenses.{" "}
                        </Typography>
                      )}

                      {e && (
                        <Alert variant="outlined" severity="error">
                          {errorMessage}
                        </Alert>
                      )}
                      {lastDate && lastDate !== "a" ? (
                        <Box>
                          <Button
                            onClick={() =>
                              submit(team.teamName, team.admin, team._id)
                            }
                            variant="contained"
                            sx={{
                              mt: 2,
                              mr: 2,
                              mb: 4,
                              bgcolor: "#51087E",
                              "&:hover": {
                                backgroundColor: "#51087E",
                              },
                            }}
                          >
                            DENY TRANSACTION
                          </Button>
                        </Box>
                      ) : (
                        <></>
                      )}
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
