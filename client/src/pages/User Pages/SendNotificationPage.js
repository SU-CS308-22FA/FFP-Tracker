import React from "react";
import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
//import 'bootstrap/dist/css/bootstrap.min.css';
import ContactUs from "../../components/User Components/NotificationForm";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import { UserContext } from "../../contexts/userContext";
import { useContext, useState } from "react";


export default function SendNotificationPage() {
  const { user } = useContext(UserContext);

  const content = (
    <>
      <ProfileAppBar user={user} />      
      <center>
        <h1>Notifications</h1>
      </center>
      <div className="App">
        <div className="container">
          <ContactUs/>
        </div>
      </div>
    </>
  );
  return content;

}
