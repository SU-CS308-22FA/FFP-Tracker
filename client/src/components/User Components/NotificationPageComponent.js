import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import { Fragment, useState, useEffect, useContext } from "react";
import FFP_API from "../../app/api";
import { UserContext } from "../../contexts/userContext";
import { Container } from "@mui/system";

export default function NotificationPageComponent() {
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Button to delete notification size is small
  const DeleteButton = (props) => {
    return (
      <Container align="center" sx={{ mt: 0.5 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteNotification(props._id)}
          size="small"
        >
          Delete
        </Button>
      </Container>
    );
  };

  // template for notification using list
  const notificationTemplate = (notification) => {
    return (
      <ListItem alignItems="flex-start">
        <ListItemText
          primaryTypographyProps={{ align: "center" }}
          primary={notification.subject}
          secondary={
            <Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
                align="center"
              >
                {getUserFullName(notification.sender)}
              </Typography>
              {" — " + notification.message}
              <br></br>
              {DeleteButton(notification)}
            </Fragment>
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
              key={notification._id}
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {notificationTemplate(notification)}
              <Divider variant="inset" component="li" />
            </Box>
          );
        }
        return null;
      });
    }
  };

  //create notification function
  async function createNotification(sender, receiver, subject, message) {
    await FFP_API.post("/notifications", {
      sender: sender,
      receiver: receiver,
      subject: subject,
      message: message,
    })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        setE(true);
        setErrorMessage("Error creating notification");
      });
  }

  // handle send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const receiver = findUserIdByUsername(data.get("receiver_username"));
      const sender = user._id;
      const subject = data.get("subject");
      const message = data.get("message");
      await createNotification(sender, receiver, subject, message);
      if (!e) alert("Notification sent!");
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data.message);
    }
  };

  // form to send a notification
  const sendNotificationForm = () => {
    return (
      <>
        <Box
          component="form"
          onSubmit={handleSendNotification}
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          noValidate
          autoComplete="off"
        >
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
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send In-App Notification
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <CssBaseline />
      <Typography
        variant="h3"
        component="div"
        align="center"
        gutterBottom
        sx={{ mt: 4 }}
      >
        Notifications
      </Typography>
      <Container align="center">
        <Button variant="contained" color="primary" href="/sendnotification">
          Send Email
        </Button>
      </Container>
      <Typography
        variant="h5"
        component="div"
        align="center"
        gutterBottom
        sx={{ mt: 2 }}
      >
        Your In-App Notifications
      </Typography>
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
      {e && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
