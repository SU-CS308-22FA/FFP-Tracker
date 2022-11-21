import React from "react";
import FrontPageAppBar from "../components/Public Components/FrontPageAppBar";
//import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "../components/NotificationForm";

export default function NotificationPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams", "Login", "Sign Up"]} />
      <center>
        <h1>Send Notifications</h1>
      </center>
      <div className="App">
        <br></br>
        <div className="container">
          <ContactUs />
        </div>
        <br></br>
      </div>
    </>
  );
  return content;
}
