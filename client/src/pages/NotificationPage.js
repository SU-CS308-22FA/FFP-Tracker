import React from "react";
import FrontPageAppBar from "../components/FrontPageAppBar";
import { Button } from "@mui/material";
import NotificationPageComponent from "../components/NotificationPageComponent";
//import 'bootstrap/dist/css/bootstrap.min.css';



export default function NotificationPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home","Teams", "Login", "Sign Up"]} />
      <center>
        <h1>Send Notifications</h1>
      </center>
      <div className="App">
        <br></br>
        <div className="container">
          <Button variant="contained" color="primary" href="/sendnotification"> SEND EMAIL NOTIFICATION </Button>
        </div>
        <br></br>

      </div>
    </>
  );
  return content;

}
