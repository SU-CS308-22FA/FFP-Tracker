import React from "react";
import FrontPageAppBar from "../components/Public Components/FrontPageAppBar";
//import 'bootstrap/dist/css/bootstrap.min.css';
import ContactUs from "../components/NotificationForm";


export default function SendNotificationPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home","Teams", "Notification", "Login", "Sign Up"]} />
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
