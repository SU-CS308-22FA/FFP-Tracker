import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import {
  Button,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Container,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProfilePageComponent() {
  const { user } = useContext(UserContext);
  let roleBasedContent = null;
  const navigate = useNavigate();

  function CustomCard(props) {
    return (
      <>
        <Card
          style={{
            backgroundColor: "#f5f5f5",
          }}
          sx={{ width: 350 }}
        >
          <CardActionArea
            onClick={() => {
              navigate(props.link);
            }}
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
              <Typography variant="body2" align="center">
                {props.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </>
    );
  }

  const regularContent = (
    <>
      <Grid item xs={4}>
        <CustomCard
          title="View All Teams"
          description="View all teams expense and revenue data supported by graphs"
          link="/teams"
        />
      </Grid>
      <Grid item xs={4}>
        <CustomCard
          title="Edit Your Profile"
          link="edit"
          description="Edit your fullname, username, and change your password"
        />
      </Grid>
      <Grid item xs={4}>
        <CustomCard
          title="View Your Notifications"
          description="View your in-app notifications as well as send emails and in-app notifications"
          link="notifications"
        />
      </Grid>
    </>
  );

  if (user.role === "Team Admin") {
    roleBasedContent = (
      <>
        <Grid item xs={4}>
          <CustomCard
            title="Submit Files"
            link="/submit"
            description="Submit your expenses and revenues"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomCard
            title="Edit Your Team"
            link="/edit/team"
            description="Edit information about your team"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomCard
            title="View File Status"
            link="/status"
            description="View the status of your submitted files"
          />
        </Grid>
      </>
    );
  } else if (user.role === "TFF Admin") {
    roleBasedContent = (
      <>
        <Grid item xs={4}>
          <CustomCard
            title="Add a Team"
            link="/newteam"
            description="Add a new team to the database to keep track of their finances"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomCard
            title="Delete a Team"
            link="/deleteteam"
            description="Delete a team from the database that has been relegated, disbanded, or went bankrupt"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomCard
            title="Reject a Team's Submission"
            link="/denytransaction"
            description="Deny a team's transaction due to sisapproval from a lawyer"
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={4}>
          <CustomCard
            title="View File Status"
            link="/status"
            description="View the status of all submitted financial declarations"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomCard
            title="Send Key"
            link="/sendkey"
            description="Send a registration key to any type of user that needs to enter the system"
          />
        </Grid>
        <Grid item xs={2} />
      </>
    );
  } else {
    roleBasedContent = (
      <>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <CustomCard
            title="Review Submissions"
            link="/status"
            description="Review all teams submissions, review the files, and approve or disapprove them"
          />
        </Grid>
        <Grid item xs={4} />
      </>
    );
  }
  const content = (
    <>
      <Container component="main" maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mt: 4 }} align="center">
          Welcome to FFP Tracker, {user.fullname}!
        </Typography>
        <Typography variant="h6" gutterBottom align="center" sx={{ mt: 6 }}>
          As a {user.role}, you can:
        </Typography>
        <Grid container sx={{ mt: 6 }} rowSpacing={2}>
          {roleBasedContent}
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          {regularContent}
        </Grid>
      </Container>
    </>
  );
  return content;
}
