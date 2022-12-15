import ContactUs from "../../components/User Components/NotificationForm";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function SendNotificationPage() {
  const content = (
    <>
      <ProfileAppBar />
      <center>
        <h1>Notifications</h1>
      </center>
      <div className="App">
        <div className="container">
          <ContactUs />
        </div>
      </div>
    </>
  );
  return content;
}
