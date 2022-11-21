import { Navigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import CircularProgressComponent from "./CircularProgressComponent";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import FFP_API from "../app/api";



export default function ProfilePageComponent() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const unreadNotifications = user.notifications.filter(
    (notification) => notification.read === false
  );
  const readNotifications = user.notifications.filter(
    (notification) => notification.read === true
  );

// create a notification template showing the notification subject, message, from and read status
  const notificationTemplate = (notification) => {
    return (
      <div>
        <Typography variant="body2" color="text.secondary">
          From: {notification.from}
        </Typography>
        <Typography variant="h6" component="h2">
          Subject: {notification.subject}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Message: "{notification.message}"
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.read ? "Read" : "Unread"}
        </Typography>
      </div>
    );
  };




// represent unread and read notifications in two separate lists
  const allNotifications = (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Unread
      </Typography>
      {unreadNotifications.length > 0 ? (
        unreadNotifications.map((notification) => (
          <Container key={notification._id}>
          <div key={notification._id}>
          {notificationTemplate(notification)}  
          </div>
          </Container>
        ))
      ) : (
        <CircularProgressComponent />
      )}
      <Typography variant="h5" component="h2" gutterBottom>
        Read
      </Typography>
      {readNotifications.length > 0 ? (
        readNotifications.map((notification) => (
          <div key={notification._id}>
            <Typography variant="body1" gutterBottom>
              {notification.message}
            </Typography>
          </div>
        ))
      ) : (
        <CircularProgressComponent />
      )}
    </Container>
  );





  const content = !user ? (
    <Navigate to="/login" />
  ) : (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ m: 4 }} align="center">
          Welcome, {user.fullname}!
        </Typography>
        <Typography variant="body1" sx={{ m: 2 }} align="center">
          As a {user.role}, you can edit your profile, submit and review files,
          and much more thingss!
        </Typography>
        {allNotifications}
        
      </Container>
    </>
  );
  return content;
}
