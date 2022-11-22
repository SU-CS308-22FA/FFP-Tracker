import React from "react";
import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import { Button } from "@mui/material";
import NotificationPageComponent from "../../components/User Components/NotificationPageComponent";
import { UserContext } from "../../contexts/userContext";
import { useContext, useState } from "react";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function NotificationPage() {
  const { user } = useContext(UserContext);

  const content = (
    <>
      <ProfileAppBar user={user} />
      <center>
        <h1>Send Email Notification</h1>
      </center>
      <div className="App">
        <br></br>
        <div className="container">
          <Button variant="contained" color="primary" href="/sendnotification">
            {" "}
            SEND EMAIL NOTIFICATION{" "}
          </Button>
        </div>
        <br></br>
        <NotificationPageComponent />
      </div>
    </>
  );
  return content;
}
