import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import { useState, useEffect, useContext } from "react";
import FFP_API from "../../app/api";
import { UserContext } from "../../contexts/userContext";

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
      <Container align="center">
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteNotification(props._id)}
        >
          Delete
        </Button>
      </Container>
    );
  };

  // template for notification using list
  const notificationTemplate = (notifications) => {
    const columns = [
      {
        field: "subject",
        headerName: "Subject",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "sender",
        headerName: "Sender",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return getUserFullName(params.row.sender);
        },
      },
      {
        field: "date",
        headerName: "Date",
        width: 120,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return params.row.date.substring(0, 10);
        },
      },
      {
        field: "message",
        headerName: "Message",
        width: 500,
        headerAlign: "center",
        align: "left",
      },
      {
        field: "delete",
        headerName: "Delete",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return DeleteButton(params.row);
        },
      },
    ];

    return (
      <DataGrid
        rows={notifications}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={10}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    );
  };

  // display all notifications for a user with notification subject and message and sender
  const displayNotifications = (userid) => {
    if (notification) {
      let notif = [];
      notification.map(function (notification) {
        if (notification.receiver === userid) {
          notif.push(notification);
        }
        return 1;
      });
      return notificationTemplate(notif);
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
        <Typography variant="h5" align="center" sx={{}}>
          Send In-app Notifications
        </Typography>
        <Box
          component="form"
          onSubmit={handleSendNotification}
          sx={{
            "& .MuiTextField-root": { m: 1, width: "28ch" },
            alignItems: "center",
            flexDirection: "column",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
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
            multiline
            rows={3}
          />
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send Notification
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
      <Box
        sx={{
          mt: 4,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Paper component={Box} width={1100} height={630.5}>
          {displayNotifications(user._id)}
        </Paper>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={12} sm={6}>
          {sendNotificationForm()}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center" sx={{}}>
            Send Email
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              href="/sendnotification"
            >
              Send Email
            </Button>
          </Box>
        </Grid>
      </Grid>
      {e && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
