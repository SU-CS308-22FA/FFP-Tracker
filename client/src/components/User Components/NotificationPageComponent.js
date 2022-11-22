import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FFP_API from "../../app/api";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";

const theme = createTheme();

export default function NotificationPageComponent() {
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotification = async () => {
      const response = await FFP_API.get(`/notifications`);
      setNotification(response.data);
    };
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    fetchUsers();
    fetchNotification();
  }, [setNotification, setUsers]);

  // get user full name from user id
  const getUserFullName = (id) => {
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id === id) {
          return users[i].fullname;
        }
      }
    }
  };

  // find user id by email
  const findUserIdByEmail = (email) => {
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          return users[i]._id;
        }
      }
    }
  };

  // find user id by username
  const findUserIdByUsername = (username) => {
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          return users[i]._id;
        }
      }
    }
  };

  // delete notification by id
  function deleteNotification(id) {
    FFP_API.delete(`/notifications/${id}`)
      .then((response) => {
        console.log(response);
        console.log("Notification deleted");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Button to delete notification size is small
  const DeleteButton = (props) => {
    return (
      <Button
        variant="contained"
        color="error"
        onClick={() => deleteNotification(props._id)}
        size="small"
      >
        Delete
      </Button>
    );
  };

  // template for notification using list
  const notificationTemplate = (notification) => {
    return (
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={notification.subject}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {getUserFullName(notification.sender)}
              </Typography>
              {" — " + notification.message}
              <br></br>
              {DeleteButton(notification)}
            </React.Fragment>
          }
        />
      </ListItem>
    );
  };

  // display all notifications for a user with notification subject and message and sender
  const displayNotifications = (userid) => {
    if (notification) {
      return notification.map((notification) => {
        if (notification.receiver === userid) {
          return (
            <Box
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {notificationTemplate(notification)}
              <Divider variant="inset" component="li" />
            </Box>
          );
        }
      });
    }
  };

  //create notification function
  function createNotification(sender, receiver, subject, message) {
    FFP_API.post("/notifications", {
      sender: sender,
      receiver: receiver,
      subject: subject,
      message: message,
    })
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        setE(true);
        setErrorMessage("Error creating notification");
      });
  }

  // handle send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      console.log(data.get("subject"));
      console.log(data.get("message"));
      console.log(user._id);
      console.log(findUserIdByUsername(data.get("receiver_username")));
      const receiver = findUserIdByUsername(data.get("receiver_username"));
      const sender = user._id;
      const subject = data.get("subject");
      const message = data.get("message");
      createNotification(sender, receiver, subject, message);
    } catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage(error.response.data.message);
    }
  };

  // form to send a notification
  const sendNotificationForm = () => {
    return (
      <Box
        component="form"
        onSubmit={handleSendNotification}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="receiver_username"
            name="receiver_username"
            label="Receiver Username"
            defaultValue=""
            variant="filled"
          />
          <TextField
            required
            id="subject"
            name="subject"
            label="Subject"
            defaultValue=""
            variant="filled"
          />
          <TextField
            required
            id="message"
            name="message"
            label="Message"
            defaultValue=""
            variant="filled"
          />
        </div>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          Send App Notification
        </Button>
      </Box>
    );
  };

  return (
    <div>
      <h1>Notifications</h1>
      <List
        sx={{
          alignItems: "center",
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        {displayNotifications(user._id)}
      </List>
      {sendNotificationForm()}
    </div>
  );
}
