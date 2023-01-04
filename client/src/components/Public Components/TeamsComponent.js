import CircularProgressComponent from "./CircularProgressComponent";
import FFP_API from "../../app/api";
import Plot from "react-plotly.js";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function TeamsComponent() {
  const [teams, setTeams] = useState(null);
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (months.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Typography align="center">
            There are no records for <br /> {team.teamName} in the database.
          </Typography>
        </Box>
      );
    } else {
      const plotContent = (
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
            width: 400,
            height: 300,
            title: `<a href = "/teams/${team._id}" target = "_self">${team.teamName}</a>`,
            yaxis: {
              title: "Amount in Million TLs",
            },
            xaxis: {
              title: "Months",
            },
          }}
        />
      );
      return (
        <>
          <Box
            sx={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              m: 2,
            }}
          >
            {plotContent}
          </Box>
        </>
      );
    }
  }
  const content = (
    <>
      <Typography variant="h3" align="center" sx={{ mt: 4 }}>
        All Teams in the League
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {!loading ? (
          teams.map((team) => {
            let tempRev = revenues.filter(
              (revenue) => revenue.teamId === team._id
            );
            let tempExp = expenses.filter(
              (expense) => expense.teamId === team._id
            );
            if (tempRev.length === 0 || tempExp.length === 0) {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Typography align="center">
                    No data available for {team.teamName}.
                  </Typography>
                </Box>
              );
            }
            return plot(team, tempRev[0], tempExp[0]);
          })
        ) : (
          <CircularProgressComponent />
        )}
      </Box>
    </>
  );
  return content;
}
