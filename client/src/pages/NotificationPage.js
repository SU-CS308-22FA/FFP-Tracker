import React from "react";
import FrontPageAppBar from "../components/FrontPageAppBar";
import { Button } from "@mui/material";
//import 'bootstrap/dist/css/bootstrap.min.css';


export default function NotificationPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home","Teams", "Login", "Sign Up"]} />
      <center>
        <h1>Notifications</h1>
      </center>
      <div className="App">
        <div className="container">
          <Button variant="contained" color="primary" href="/sendnotification"> SEND NOTIFICATION </Button>
        </div>
      </div>
    </>
  );
  return content;

}
