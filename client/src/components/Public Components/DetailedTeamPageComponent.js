import Plot from "react-plotly.js";
import FFP_API from "../../app/api";
import CircularProgressComponent from "./CircularProgressComponent";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

export default function DetailedTeamPageComponent() {
  const [team, setTeam] = useState(null);
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const { id } = useParams();

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
    fetchTeam();
    fetchRevenues();
    fetchExpenses();
  }, [setTeam, setRevenues, setExpenses, id]);

  function returnLastValueOfObject(obj) {
    return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
  }

  function plot(team, revenues, expenses) {
    let months = [];
    let rev = [];
    let cumRev = [];
    for (const [key, value] of Object.entries(revenues.ticketing)) {
      months.push(String(key));
      rev.push(value + revenues.marketing[key] + revenues.broadcasting[key]);
      if (cumRev.length === 0) {
        cumRev.push(
          value + revenues.marketing[key] + revenues.broadcasting[key]
        );
      } else {
        cumRev.push(
          value +
            revenues.marketing[key] +
            revenues.broadcasting[key] +
            cumRev[cumRev.length - 1]
        );
      }
    }
    let exp = [];
    let cumExp = [];
    for (const [key, value] of Object.entries(expenses.salaries)) {
      exp.push(value + expenses.amortization[key] + expenses.operational[key]);
      if (cumExp.length === 0) {
        cumExp.push(
          value + expenses.amortization[key] + expenses.operational[key]
        );
      } else {
        cumExp.push(
          value +
            expenses.amortization[key] +
            expenses.operational[key] +
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
          width: 600,
          height: 500,
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
      {team && revenues && expenses ? (
        <Grid container spacing={1}>
          <Grid item xs={5.5}>
            {plot(team, revenues, expenses)}
          </Grid>
          <Grid item xs={6.5}>
            <Typography variant="h4" align="center" sx={{ mt: 4 }}>
              Information About
              <Typography variant="h5" color="#0000FF">
                <a href={team.wikiLink}>{team.teamName}</a>
              </Typography>
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                href="/sendnotification"
              >
                {" "}
                SEND NOTIFICATION{" "}
              </Button>
            </Typography>
            <Grid container spacing={2} sx={{ mt: 6 }}>
              <Grid item xs={6}>
                <Typography variant="body1" align="center">
                  Season Starting Budget: {team.seasonBudget} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Total Revenues:{" "}
                  {returnLastValueOfObject(revenues.ticketing) +
                    returnLastValueOfObject(revenues.marketing) +
                    returnLastValueOfObject(revenues.broadcasting)}{" "}
                  Mil. TL
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="center">
                  Current Budget: {team.currentBudget} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Total Expenses:{" "}
                  {returnLastValueOfObject(expenses.salaries) +
                    returnLastValueOfObject(expenses.amortization) +
                    returnLastValueOfObject(expenses.operational)}{" "}
                  Mil. TL
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Net Spend:{" "}
              {(returnLastValueOfObject(revenues.ticketing) +
                returnLastValueOfObject(revenues.marketing) +
                returnLastValueOfObject(revenues.broadcasting) +
                -(
                  returnLastValueOfObject(expenses.salaries) +
                  returnLastValueOfObject(expenses.amortization) +
                  returnLastValueOfObject(expenses.operational)
                )) *
                -1}{" "}
              Mil. TL
            </Typography>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body1" align="center">
                  Last Month Ticketing Revenue:
                  {" " + returnLastValueOfObject(revenues.ticketing)} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Last Month Marketing Revenue:
                  {" " + returnLastValueOfObject(revenues.marketing)} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Last Month Broadcasting Revenue:
                  {" " + returnLastValueOfObject(revenues.broadcasting)} Mil. TL
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" align="center">
                  Last Month Salary Expenses:
                  {" " + returnLastValueOfObject(expenses.salaries)} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Last Month Amortization Expenses:
                  {" " + returnLastValueOfObject(expenses.amortization)} Mil. TL
                </Typography>
                <Typography variant="body1" align="center">
                  Last Month Operational Expenses:
                  {" " + returnLastValueOfObject(expenses.operational)} Mil. TL
                </Typography>
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
