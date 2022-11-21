import { Navigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import CircularProgressComponent from "./CircularProgressComponent";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import FFP_API from "../app/api";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';




export default function ProfilePageComponent() {
  const[notifications, setNotifications] = useState(null);
  const[user, setUser] = useState(null);

  const { id } = useParams();
  useEffect(() => {
    
    const fetchNotifications = async () => {
      const response = await FFP_API.get(`/notifications/`);
      console.log(response.data);
      setNotifications(response.data);
    };
    const fetchUser = async () => {
      const response = await FFP_API.get(`/users/${id}`);
      setUser(response.data);
    };
    fetchNotifications();
    fetchUser();
    
  }, [setUser, setNotifications, id]);



  // delete a notification
  const deleteNotification = async (notificationid) => {
    const response = await FFP_API.delete(`/notifications/${notificationid}`);
    console.log(response.data);
    setNotifications(response.data);
  };

// create a notification
  const createNotification = async (senderid, recieverid, subject, message) => {
    const response = await FFP_API.post(`/notifications/`, {
      sender: senderid,
      reciever: recieverid,
      subject: subject,
      message: message,
    });
    console.log(response.data);
    setNotifications(response.data);
  };


const getUserByID = async (id) => {
  const response = await FFP_API.get(`/users/${id}`);
  return response.data;
}

//get user mail by username
const getUserMailbyUsername = async (username) => {
  const response = await FFP_API.get(`/users/`);
  console.log(response.data);
  const user = response.data.find(user => user.username === username);
  return user.email;
}

// create a form for creating a notification
  const createNotificationForm = async (e) => {
    e.preventDefault();
    console.log(e.target.message.value);
    console.log(e.target.subject.value);
    const senderid = await getUserMailbyUsername(e.target.sender.value);
    const recieverid = await getUserMailbyUsername(e.target.reciever.value);
    console.log(e.target.message.value);
    console.log(e.target.subject.value);
    createNotification(senderid, recieverid, e.target.subject.value, e.target.message.value);
    e.target.reset();
  };

  // create a form content for creating a notification
  const createNotificationFormContent = () => {
    return (
      <form onSubmit={createNotificationForm}>
        <label> Sender: </label>
        <input type="text" name="sender" />
        <label> Reciever: </label>
        <input type="text" name="reciever" />
        <label> Subject: </label>
        <input type="text" name="subject" />
        <label> Message: </label>
        <input type="text" name="message" />
        <input type="submit" value="Create Notification" />
      </form>
    );
  };

 


// create a notification template showing the notification subject, message, from and read status using list and list items
  const notificationTemplate = (notification) => {
    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        <ListItem>
          <ListItemText primary={notification.subject} secondary={notification.message} />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText primary={notification.sender}/>
          <Button variant="contained" onClick={() => deleteNotification(notification._id)}>Delete</Button>
        </ListItem>
        
      </List>
    );
  };


// represent unread and read notifications in two separate lists
  function showNotifications(notifications) {
    let unread = [];
    let read = [];
    let all = [];
    for (const [key, value] of Object.entries(notifications)) {
      if (value.read === false && value.reciever === user._id) {
        unread.push(value);
      } else if (value.read === true && value.reciever === user._id) {
        read.push(value);
      }
    }

    for (const [key, value] of Object.entries(notifications)) {
      all.push(value);
    }


    // return (
    //   <div>
    //     <Typography variant="h5" component="h2" gutterBottom>
    //       Unread Notifications
    //     </Typography>
    //     {unread.map((notification) => ( notificationTemplate(notification)))}
    //     <Typography variant="h5" component="h2" gutterBottom>
    //       Read Notifications
    //     </Typography>
    //     {read.map((notification) => ( notificationTemplate(notification)))}
    //   </div>
    // );

    return (
      <div>
        <Typography variant="h5" component="h2" gutterBottom>
          All Notifications
        </Typography>
        {all.map((notification) => ( notificationTemplate(notification)))}
      </div>
    );

  }

// <Button variant="contained" sx={{ m: 2 }} onClick={() => createNotification("636f949c4f57d04b87cb2b98", "636abddd67312dcd2ad11076", "Test Subject", "Test Message")}> Create Notification</Button>

  

  const content = !user ? (
    <CircularProgressComponent />
  ) : (
    <>
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ m: 4 }} align="center">
          Welcome, {user.fullname}!
        </Typography>
        <Typography variant="body1" sx={{ m: 2 }} align="center">
          As a {user.role}, you can edit your profile, submit and review files,
          and much more things!
        </Typography>
        {showNotifications(notifications)}
              
      </Container>
    </>
  );
  return content;
}
