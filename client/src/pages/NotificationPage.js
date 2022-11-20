import React from "react";
import FrontPageAppBar from "../components/FrontPageAppBar";
//import 'bootstrap/dist/css/bootstrap.min.css';
import ContactUs from "../components/NotificationForm";


export default function NotificationPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home","Teams", "Login", "Sign Up"]} />
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
