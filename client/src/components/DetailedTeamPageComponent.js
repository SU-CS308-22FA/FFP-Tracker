import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FFP_API from "../app/api";
import CircularProgressComponent from "./CircularProgressComponent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

export default function DetailedTeamPageComponent() {
  const [team, setTeam] = useState(null);
  // const [info, setInfo] = useState(null);

  const { id } = useParams();
  useEffect(() => {
    const fetchTeam = async () => {
      const response = await FFP_API.get(`/teams/${id}`);
      setTeam(response.data);
    };
    fetchTeam();
  }, [setTeam, id]);

  const plot = (team) => (
    <Plot
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
        width: 600,
        height: 450,
        title: `${team.teamName}`,
        legend: { x: 0, y: 1 },
      }}
    />
  );
  const content = (
    <>
      {team ? (
        <Grid container spacing={1}>
          <Grid item xs={5.5}>
            {plot(team)}
          </Grid>
          <Grid item xs={6.5}>
            <Typography variant="h4" align="center" sx={{ mt: 4 }}>
              Information About
              <Typography variant="h5" color="#0000FF">
                <a href={team.wikiLink}>{team.teamName}</a>
              </Typography>
            </Typography>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Season Starting Budget: {team.seasonBudget}
            </Typography>
            <Typography variant="body1">
              Current Budget: {team.currentBudget}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <CircularProgressComponent />
      )}
    </>
  );
  return content;
}
