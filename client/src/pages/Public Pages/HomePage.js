import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GavelIcon from "@mui/icons-material/Gavel";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import RecommendIcon from "@mui/icons-material/Recommend";

export default function HomePage() {
  const { user } = useContext(UserContext);
  let navItems;
  if (user) {
    navItems = ["Teams"];
  } else {
    navItems = ["Teams", "Sign Up"];
  }
  const content = (
    <>
      <FrontPageAppBar navItems={navItems} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Avatar
          align="center"
          src="favicon.ico"
          sx={{ width: 400, height: 200 }}
          variant="square"
        />
      </Box>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        About This Site - Financial Fair Play Tracker
      </Typography>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ m: 4 }}>
          This site is for TFF to track the financial status of the teams in the
          Turkish Super League. The site is for the use of TFF, the teams
          themselves, and the independent lawyers associated with the
          Federation. Also, the site is for the use of all fans around the world
          who are interested in the Turkish League.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    <SupervisorAccountIcon />
                  </Avatar>
                }
                title="TFF Admin"
              />
              <CardContent>
                <Typography variant="body2">
                  TFF Admins can add new teams, remove existing teams, dismiss a
                  team's last month reports, send a key for new person to join
                  the system, and view all the reports.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ minHeight: 172 }}>
              <CardHeader
                avatar={
                  <Avatar>
                    <GavelIcon />
                  </Avatar>
                }
                title="Independent Lawyer"
              />
              <CardContent>
                <Typography variant="body2">
                  Independent lawyers can review submission, approve and
                  disapprove them, and view all the reports.
                  <br />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    <SportsSoccerIcon />
                  </Avatar>
                }
                title="Team Admin"
              />
              <CardContent>
                <Typography variant="body2">
                  Team Admins can submit their monthly reports, view their
                  reports, and edit information about their team.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    <SportsSoccerIcon />
                  </Avatar>
                }
                title="Fan"
              />
              <CardContent>
                <Typography variant="body2">
                  Fans can view the financial graphs of all teams as well as
                  some detailed information about their last submissions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} />
          <Grid item xs={12} sm={4}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    <SportsSoccerIcon />
                  </Avatar>
                }
                title="Sponsor"
              />
              <CardContent>
                <Typography variant="body2">
                  Sponsor can view all the teams, and request to sponsor a team
                  for the season.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} />
        </Grid>
      </Container>
    </>
  );
  return content;
}
