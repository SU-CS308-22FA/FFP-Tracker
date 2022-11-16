import Plot from "react-plotly.js";
import { useState, useEffect } from "react";
import FFP_API from "../app/api";
import CircularProgressComponent from "./CircularProgressComponent";
import { Typography } from "@mui/material";

export default function TeamsComponent() {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await FFP_API.get("/teams");
      setTeams(response.data);
    };
    fetchTeams();
  }, [setTeams]);

  const plot = (team) => (
    <Plot
      key={team._id}
      data={[
        {
          type: "bar",
          x: ["Aug 2021", "Sep 2021", "Nov 2021"],
          y: [2, 1, 3],
          name: "Monthly Expenses",
        },
        {
          type: "line",
          x: ["Aug 2021", "Sep 2021", "Nov 2021"],
          y: [2, 3, 6],
          name: "Total Expenses",
        },
      ]}
      layout={{
        width: 420,
        height: 315,
        title: `<a href = "${team._id}" target = "_self">${team.teamName}</a>`,
      }}
    />
  );
  const content = (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        All Teams in Super League
      </Typography>
      <div>
        {teams ? (
          teams.map((team) => {
            return plot(team);
          })
        ) : (
          <CircularProgressComponent />
        )}
      </div>
    </>
  );
  return content;
}
