import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function ProfilePageComponent() {
  const { user } = useContext(UserContext);
  let roleBasedContent = null;
  if (user.role === "Team Admin") {
    roleBasedContent = (
      <Typography variant="h6" gutterBottom>
        As a team admin, you can submit your team's monthly expenses and
        revenues, view your notifications,manage support requests, edit you
        profile as well as change information about your team. You can also view
        your team's current budget and the budget history.
      </Typography>
    );
  } else if (user.role === "TFF Admin") {
    roleBasedContent = (
      <Typography variant="h6" gutterBottom>
        As a TFF admin, you can register new teams, send keys to users, view all
        teams and their budgets, view all users and their roles, send warnings
        to team admins.
      </Typography>
    );
  } else if (user.role === "Lawyer") {
    roleBasedContent = (
      <Typography variant="h6" gutterBottom>
        As a lawyer, you can view your notifications, edit your profile, review
        the submitted expenses and revenues, ratify them.
      </Typography>
    );
  } else {
    roleBasedContent = (
      <Typography variant="h6" gutterBottom>
        As a supporter, you can view your notifications, edit your profile, you
        can support teams, view all teams and their budgets.
      </Typography>
    );
  }
  const content = (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ m: 4 }} align="center">
          Welcome, {user.fullname}!
        </Typography>
        {roleBasedContent}
        <Typography variant="body1" sx={{ mt: 2 }} align="center"></Typography>
      </Container>
    </>
  );
  return content;
}
