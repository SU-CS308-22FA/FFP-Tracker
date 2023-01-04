import Plot from "react-plotly.js";
import FFP_API from "../../app/api";
import CircularProgressComponent from "./CircularProgressComponent";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { UserContext } from "../../contexts/userContext";
import SimpleLinearRegression from "ml-regression-simple-linear";

export default function DetailedTeamPageComponent() {
  const [users, setUsers] = useState(null);
  const { token, user, setUser } = useContext(UserContext);
  const [team, setTeam] = useState(null);
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const { id } = useParams();

  function CustomCard(props) {
    return (
      <>
        <Card
          style={{
            backgroundColor: "#f5f5f5",
          }}
          sx={{ width: 330 }}
        >
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              align="center"
              fontWeight="bold"
            >
              {props.title}
            </Typography>
            {typeof props.content === "object" ? (
              props.content.map((item) => {
                if (props.title.indexOf("Associated") !== -1) {
                  const person = JSON.parse(item);
                  return (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      style={{ color: "#0000FF" }}
                      key={person}
                    >
                      <a href={`mailto:${person.email}`}>{person.name}</a>
                    </Typography>
                  );
                }
                return (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    key={item}
                  >
                    {item}
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                {props.content}
              </Typography>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

  useEffect(() => {
    const fetchTeam = async () => {
      const response = await FFP_API.get(`/teams/${id}`);
      setTeam(response.data);
    };
    const fetchRevenues = async () => {
      const response = await FFP_API.get(`/revenues/${id}`);
      setRevenues(response.data);
    };
    const fetchExpenses = async () => {
      const response = await FFP_API.get(`/expenses/${id}`);
      setExpenses(response.data);
    };
    const fetchUser = async () => {
      const response = await FFP_API.get(`/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    };
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    fetchTeam();
    fetchRevenues();
    fetchExpenses();
    fetchUser();
    fetchUsers();
  }, [setTeam, setRevenues, setExpenses, token, setUser, id, setUsers]);

  function hasSupporter() {
    for (let i = 0; i < users.length; i++) {
      if (
        users[i].role === "Supporter" &&
        users[i].team === team._id &&
        users[i].isSupporting
      ) {
        return true;
      }
    }
    return false;
  }

  // takes an integer input and returns sequence of integers from 0 to input
  function getSequence(input) {
    let sequence = [];
    for (let i = 1; i < input + 1; i++) {
      sequence.push(i);
    }
    return sequence;
  }

  // write a linear regression prediction function for revenues
  function predictRevenue() {
    let x = getSequence(Object.keys(revenues.ticketing).length);
    let y = [];

    // get the values of each revenue objects
    // for (const [key, value] of Object.entries(revenues.ticketing)) {
    //   y.push(value + revenues.marketing[key] + revenues.broadcasting[key]);
    // }
    // revert the order of the y array
    //y = y.reverse();

    let expensesByMonth = {};
    for (const [key, value] of Object.entries(revenues.ticketing)) {
      expensesByMonth[key] = value;
    }
    for (const [key, value] of Object.entries(revenues.marketing)) {
      expensesByMonth[key] += value;
    }
    for (const [key, value] of Object.entries(revenues.broadcasting)) {
      expensesByMonth[key] += value;
    }
    let months = [];
    for (const [key, value] of Object.entries(expensesByMonth)) {
      months.push(String(key));
    }
    months.sort((a, b) => {
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
    for (let i = 0; i < months.length; i++) {
      y.push(expensesByMonth[months[i]]);
    }
    // print y
    //console.log("y is in Revenues:", y);

    // if only 1 data, return that data
    if (x.length === 1) {
      return y[0];
    }
    // create a linear regression model
    const model = new SimpleLinearRegression(x, y);

    // predict the next revenue
    let prediction = model.predict(x.length + 1);
    //console.log("Revenue prediction for next month is:" + prediction);
    return prediction;
  }

  // write a linear regression prediction function for expenses
  function predictExpense() {
    let x = getSequence(Object.keys(expenses.salaries).length);
    let y = [];
    // get the values of each expense objects
    // for (const [key, value] of Object.entries(expenses.salaries)) {
    //   y.push(value + expenses.amortization[key] + expenses.operational[key]);
    // }

    // get expenses by considering key values as month-year and sorting them

    let expensesByMonth = {};
    for (const [key, value] of Object.entries(expenses.salaries)) {
      expensesByMonth[key] = value;
    }
    for (const [key, value] of Object.entries(expenses.amortization)) {
      expensesByMonth[key] += value;
    }
    for (const [key, value] of Object.entries(expenses.operational)) {
      expensesByMonth[key] += value;
    }
    let months = [];
    for (const [key, value] of Object.entries(expensesByMonth)) {
      months.push(String(key));
    }
    months.sort((a, b) => {
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
    for (let i = 0; i < months.length; i++) {
      y.push(expensesByMonth[months[i]]);
    }
    // print y
    //console.log("y is in Expenses:", y);

    // if only 1 data, return that data
    if (x.length === 1) {
      return y[0];
    }

    // create a linear regression model
    const model = new SimpleLinearRegression(x, y);

    // predict the next expense
    let prediction = model.predict(x.length + 1);
    //console.log("Expense prediction for next month is:" + prediction);
    return prediction;
  }

  // predict Net Spend
  function predictNetSpend() {
    return predictRevenue() - predictExpense();
  }

  /**
   * This function takes an object as input and
   * returns the total of all the values in the object
   *
   * @function returnTotalOfObject
   * @param {Object} obj Object to be summed up
   * @returns {integer} total of all the values in the object
   */
  function returnTotalOfObject(obj) {
    let total = 0;
    for (let i = 0; i < Object.keys(obj).length; i++) {
      total += obj[Object.keys(obj)[i]];
    }
    return total;
  }

  function returnLastValueOfObject(obj) {
    let months = [];
    for (const [key, value] of Object.entries(obj)) {
      months.push(String(key));
    }
    months.sort((a, b) => {
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
    return obj[months[months.length - 1]];
  }

  function plot(team, revenues, expenses) {
    let months = [];
    for (const [key, value] of Object.entries(revenues.ticketing)) {
      months.push(String(key));
    }
    months.sort((a, b) => {
      const aYear = Number(a.slice(0, 4));
      const bYear = Number(b.slice(0, 4));
      const aMonth = Number(a.slice(5, 7));
      const bMonth = Number(b.slice(5, 7));
      if (aYear > bYear) return 1;
      else if (aYear < bYear) return -1;
      else return aMonth - bMonth;
    });
    let rev = [];
    let cumRev = [];
    for (let i = 0; i < months.length; i++) {
      rev.push(
        revenues.ticketing[months[i]] +
          revenues.marketing[months[i]] +
          revenues.broadcasting[months[i]]
      );
      if (cumRev.length === 0) {
        cumRev.push(
          revenues.ticketing[months[i]] +
            revenues.marketing[months[i]] +
            revenues.broadcasting[months[i]]
        );
      } else {
        cumRev.push(
          revenues.ticketing[months[i]] +
            revenues.marketing[months[i]] +
            revenues.broadcasting[months[i]] +
            cumRev[cumRev.length - 1]
        );
      }
    }
    let exp = [];
    let cumExp = [];
    for (let i = 0; i < months.length; i++) {
      exp.push(
        expenses.salaries[months[i]] +
          expenses.amortization[months[i]] +
          expenses.operational[months[i]]
      );
      if (cumExp.length === 0) {
        cumExp.push(
          expenses.salaries[months[i]] +
            expenses.amortization[months[i]] +
            expenses.operational[months[i]]
        );
      } else {
        cumExp.push(
          expenses.salaries[months[i]] +
            expenses.amortization[months[i]] +
            expenses.operational[months[i]] +
            cumExp[cumExp.length - 1]
        );
      }
    }
    const content = (
      <Plot
        key={team._id}
        data={[
          {
            type: "bar",
            x: months,
            y: rev,
            name: "Monthly Revenues",
          },
          {
            type: "bar",
            x: months,
            y: exp,
            name: "Monthly Expenses",
          },
          {
            type: "line",
            x: months,
            y: cumExp,
            name: "Cumulative Expenses",
          },
          {
            type: "line",
            x: months,
            y: cumRev,
            name: "Cumulative Revenues",
          },
        ]}
        layout={{
          width: 500,
          height: 400,
          title: team.teamName,
          yaxis: {
            title: "Amount in Million TLs",
          },
          xaxis: {
            title: "Months",
          },
        }}
      />
    );
    return content;
  }
  const content = (
    <>
      {team && revenues && expenses && users ? (
        <Grid
          container
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={5} justifyContent="center" alignItems="center">
            {plot(team, revenues, expenses)}
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h4" align="center" sx={{ mt: 4 }}>
              Information About
            </Typography>
            <Typography
              variant="h5"
              component="h5"
              align="center"
              color="#0000FF"
            >
              <a href={team.wikiLink} target="_blank" rel="noreferrer">
                {team.teamName}
              </a>
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar sx={{ width: "auto", mt: 2 }} src={team.logoURL} />
            </Box>
            {token && user && user.role === "TFF Admin" ? (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  href="/sendnotification"
                >
                  Send Email
                </Button>
              </Typography>
            ) : null}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              {CustomCard({
                title: "Manager",
                content:
                  team.manager === ""
                    ? "No manager information."
                    : team.manager,
              })}
            </Box>
            {/* <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Manager: {team.manager}
            </Typography> */}
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Budget",
                    content: [
                      `Season Starting Budget: ${team.seasonBudget} Mil TL`,
                      `Current Budget: ${team.currentBudget} Mil TL`,
                      `Sponsor Budget: ${
                        hasSupporter() ? team.sponsorBudget : 0
                      } Mil TL`,
                    ],
                  })}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Spendings",
                    content: [
                      `Total Net Spend: ${
                        (returnTotalOfObject(revenues.ticketing) +
                          returnTotalOfObject(revenues.marketing) +
                          returnTotalOfObject(revenues.broadcasting) +
                          -(
                            returnTotalOfObject(expenses.salaries) +
                            returnTotalOfObject(expenses.amortization) +
                            returnTotalOfObject(expenses.operational)
                          )) *
                        -1
                      } Mil TL`,
                      `Net Spend Prediction for Next Month: ${
                        predictNetSpend() * -1
                      } Mil TL`,
                    ],
                  })}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Revenues",
                    content: [
                      `Total Revenues: ${
                        returnTotalOfObject(revenues.ticketing) +
                        returnTotalOfObject(revenues.marketing) +
                        returnTotalOfObject(revenues.broadcasting)
                      } Mil TL`,
                      `Last Month Ticketing: ${returnLastValueOfObject(
                        revenues.ticketing
                      )} Mil TL`,
                      `Last Month Marketing: ${returnLastValueOfObject(
                        revenues.marketing
                      )} Mil TL`,
                      `Last Month Broadcasting: ${returnLastValueOfObject(
                        revenues.broadcasting
                      )} Mil TL`,
                    ],
                  })}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Expenses",
                    content: [
                      `Total Expenses: ${
                        returnTotalOfObject(expenses.salaries) +
                        returnTotalOfObject(expenses.amortization) +
                        returnTotalOfObject(expenses.operational)
                      } Mil TL`,
                      `Last Month Salaries: ${returnLastValueOfObject(
                        expenses.salaries
                      )} Mil TL`,
                      `Last Month Amortization: ${returnLastValueOfObject(
                        expenses.amortization
                      )} Mil TL`,
                      `Last Month Operational: ${returnLastValueOfObject(
                        expenses.operational
                      )} Mil TL`,
                    ],
                  })}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mt: 0.5, mb: 4 }}>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Associated Lawyers",
                    content: team.lawyers,
                  })}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {CustomCard({
                    title: "Associated Board Members",
                    content: team.boardMembers,
                  })}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <CircularProgressComponent />
      )}
    </>
  );
  return content;
}
